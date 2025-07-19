// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title HealFund
 * @dev A crowdfunding contract for patient medical appeals with endorsement, rejection,
 *      automatic payout upon reaching the target, and manual payout option.
 */
contract HealFund is ReentrancyGuard {
    /** @dev The authority (deployer) who can endorse, reject, and disburse funds. */
    address public authority;

    /** @dev Minimum contribution per donor. */
    uint256 public constant MIN_CONTRIBUTION = 0.02 ether;

    /** @dev Flag to pause contract operations in emergencies. */
    bool public stopped;

    /** @dev Counter for issued endorsement tokens. */
    uint256 public approvalTokenCounter;

    /**
     * @dev Represents a patient appeal with funding goal and status.
     */
    struct HealFundProject {
        address patient;
        string purpose;
        string description;
        string ipfsHash;
        uint256 targetFigure;
        uint256 targetDeadline;
        uint256 amountRaised;
        bool endorsed;
        bool rejected;
        bool completed;
        uint256 approvalTokenId;
        uint256 amountPaidOut;
        bool targetAchieved;
        bool contributionsBlocked;
    }
    /// @dev Mapping from appeal ID to project details.
    mapping(uint256 => HealFundProject) private patientAppeals;

    /// @dev Total number of appeals created.
    uint256 public patientAppealCount;

    /// @dev List of contributors for each appeal ID.
    mapping(uint256 => address[]) private contributorsList;

    /// @dev Contribution amount per contributor per appeal.
    mapping(uint256 => mapping(address => uint256)) private contributions;

    /// @dev Owner of each endorsement token ID.
    mapping(uint256 => address) public approvalTokenOwners;

    /// @dev Tracks which tokens each address owns.
    mapping(address => mapping(uint256 => bool)) public approvalTokenOwnership;

    /** @dev Emitted when a new patient appeal is created. */
    event PatientAppealCreated(
        uint256 indexed patientId,
        string purpose,
        string description,
        string ipfsHash,
        uint256 indexed targetFigure,
        uint256 targetDeadline
    );

    /** @dev Emitted when an appeal is endorsed by the authority. */
    event PatientAppealEndorsed(
        uint256 indexed patientId,
        address indexed authority
    );

    /** @dev Emitted when an appeal is rejected by the authority. */
    event HealFundProjectRejected(
        uint256 indexed patientId,
        address indexed authority
    );

    /** @dev Emitted when an endorsement token is issued to a patient. */
    event EndorsementTokenIssued(
        uint256 indexed tokenId,
        address indexed patient
    );

    /** @dev Emitted when a valid contribution is received. */
    event ContributionReceived(
        uint256 indexed patientId,
        address indexed contributor,
        uint256 amount
    );

    /** @dev Emitted when a contribution is rejected for overshooting the target. */
    event ContributionRejected(
        uint256 indexed patientId,
        address indexed contributor,
        uint256 amount,
        string reason
    );

    /** @dev Emitted when the funding target is achieved. */
    event TargetAchieved(
        uint256 indexed patientId,
        address indexed patient,
        uint256 targetAmount
    );

    /** @dev Emitted when further contributions are blocked. */
    event ContributionsBlocked(
        uint256 indexed patientId,
        address indexed authority
    );

    /** @dev Emitted when the project is marked completed. */
    event HealFundProjectCompleted(
        uint256 indexed patientId,
        address indexed patient
    );

    /** @dev Emitted when funds are disbursed to the patient. */
    event ContributionsPaidOut(
        uint256 indexed patientId,
        address indexed patient,
        uint256 amount
    );

    /** @dev Emitted when the contract is stopped or resumed. */
    event ContractStopped(bool stopped);

    /** @dev Restricts function to authority only. */
    modifier onlyAuthority() {
        require(
            msg.sender == authority,
            "Only the authority can perform this action"
        );
        _;
    }

    /** @dev Ensures the contract is not paused. */
    modifier whenNotStopped() {
        require(!stopped, "Contract is stopped");
        _;
    }

    /**
     * @dev Ensures the target for a given appeal ID is not yet achieved or rejected.
     */
    modifier canContribute(uint256 _patientId) {
        require(_patientId < patientAppealCount, "Invalid appeal ID");
        HealFundProject storage p = patientAppeals[_patientId];
        require(!p.targetAchieved, "Target already achieved");
        require(!p.rejected, "Project rejected");
        _;
    }

    /**
     * @dev Ensures the target for a given appeal ID has been achieved.
     */
    modifier targetAchieved(uint256 _patientId) {
        require(_patientId < patientAppealCount, "Invalid appeal ID");
        require(
            patientAppeals[_patientId].targetAchieved,
            "Target not yet achieved"
        );
        _;
    }

    /** @dev Sets deployer as authority. */
    constructor() {
        authority = msg.sender;
    }

    /**
     * @notice Create a new health appeal.
     * @return The newly created appeal ID.
     */
    function proposeHealthAppeal(
        string memory _purpose,
        string memory _description,
        string memory _ipfsHash,
        uint256 _targetFigure,
        uint256 _targetDeadline
    ) public whenNotStopped returns (uint256) {
        require(_targetFigure > 0, "Target must be > 0");
        require(
            _targetDeadline > block.timestamp,
            "Deadline must be in the future"
        );

        HealFundProject storage p = patientAppeals[patientAppealCount];
        p.patient = msg.sender;
        p.purpose = _purpose;
        p.description = _description;
        p.ipfsHash = _ipfsHash;
        p.targetFigure = _targetFigure;
        p.targetDeadline = _targetDeadline;

        emit PatientAppealCreated(
            patientAppealCount,
            _purpose,
            _description,
            _ipfsHash,
            _targetFigure,
            _targetDeadline
        );
        return patientAppealCount++;
    }

    /**
     * @notice Endorse an appeal and issue a token.
     */
    function endorseHealthAppeal(
        uint256 _patientId
    ) public onlyAuthority whenNotStopped {
        HealFundProject storage p = patientAppeals[_patientId];
        require(!p.endorsed, "Already endorsed");
        require(p.targetDeadline > block.timestamp, "Deadline passed");

        p.endorsed = true;
        approvalTokenCounter++;
        p.approvalTokenId = approvalTokenCounter;
        approvalTokenOwners[approvalTokenCounter] = p.patient;
        approvalTokenOwnership[p.patient][approvalTokenCounter] = true;

        emit PatientAppealEndorsed(_patientId, msg.sender);
        emit EndorsementTokenIssued(approvalTokenCounter, p.patient);
    }

    /**
     * @notice Reject an appeal, blocking further contributions.
     */
    function rejectHealthAppeal(
        uint256 _patientId
    ) public onlyAuthority whenNotStopped {
        HealFundProject storage p = patientAppeals[_patientId];
        require(!p.endorsed, "Cannot reject endorsed appeal");

        p.rejected = true;
        p.contributionsBlocked = true;
        p.completed = true;

        emit HealFundProjectRejected(_patientId, msg.sender);
    }
    /**
     * @notice Contribute ETH to an endorsed appeal.
     * @dev Automatically disburses ETH to patient once target met.
     */
    function contributeToPatient(
        uint256 _patientId
    ) public payable whenNotStopped canContribute(_patientId) nonReentrant {
        HealFundProject storage p = patientAppeals[_patientId];
        require(p.endorsed, "Not endorsed");
        require(!p.contributionsBlocked, "Contributions blocked");
        require(msg.value >= MIN_CONTRIBUTION, "Below minimum");
        require(block.timestamp < p.targetDeadline, "Deadline passed");

        // Reject overshoot
        if (p.amountRaised + msg.value > p.targetFigure) {
            emit ContributionRejected(
                _patientId,
                msg.sender,
                msg.value,
                "Would exceed target"
            );
            (bool sent, ) = payable(msg.sender).call{value: msg.value}("");
            require(sent, "Refund failed");
            return;
        }

        // Effects
        if (contributions[_patientId][msg.sender] == 0) {
            contributorsList[_patientId].push(msg.sender);
        }
        contributions[_patientId][msg.sender] += msg.value;
        p.amountRaised += msg.value;

        emit ContributionReceived(_patientId, msg.sender, msg.value);

        // If target reached, mark and auto-payout
        if (p.amountRaised >= p.targetFigure) {
            p.targetAchieved = true;
            p.contributionsBlocked = true;
            p.completed = true;

            // Auto-dispatch funds to patient
            uint256 toPay = p.amountRaised;
            p.amountPaidOut = toPay;
            (bool paid, ) = payable(p.patient).call{value: toPay}("");
            require(paid, "Auto-payout failed");

            emit TargetAchieved(_patientId, p.patient, p.targetFigure);
            emit ContributionsBlocked(_patientId, authority);
            emit HealFundProjectCompleted(_patientId, p.patient);
            emit ContributionsPaidOut(_patientId, p.patient, toPay);
        }
    }

    /**
     * @notice Disburse raised funds to the patient (manual override).
     */
    function payContributionsToPatient(
        uint256 _patientId
    )
        public
        onlyAuthority
        whenNotStopped
        targetAchieved(_patientId)
        nonReentrant
    {
        HealFundProject storage p = patientAppeals[_patientId];
        require(p.amountPaidOut == 0, "Already paid");
        uint256 toPay = p.amountRaised;
        p.amountPaidOut = toPay;
        (bool sent, ) = payable(p.patient).call{value: toPay}("");
        require(sent, "Transfer failed");

        emit ContributionsPaidOut(_patientId, p.patient, toPay);
    }

    /**
     * @notice Pause or resume contract operations.
     */
    function stopContract() public onlyAuthority {
        stopped = !stopped;
        emit ContractStopped(stopped);
    }

    /**
     * @notice Fetch appeal summary data.
     */
    function getPatientAppealDetails(
        uint256 _patientId
    )
        public
        view
        returns (
            address patient,
            string memory purpose,
            string memory description,
            string memory ipfsHash,
            uint256 targetFigure,
            uint256 targetDeadline,
            uint256 amountRaised,
            bool endorsed,
            bool rejected,
            bool completed,
            uint256 approvalTokenId,
            uint256 amountPaidOut,
            uint256 contributorCount,
            bool targetAchieved_,
            bool contributionsBlocked
        )
    {
        HealFundProject storage p = patientAppeals[_patientId];
        return (
            p.patient,
            p.purpose,
            p.description,
            p.ipfsHash,
            p.targetFigure,
            p.targetDeadline,
            p.amountRaised,
            p.endorsed,
            p.rejected,
            p.completed,
            p.approvalTokenId,
            p.amountPaidOut,
            contributorsList[_patientId].length,
            p.targetAchieved,
            p.contributionsBlocked
        );
    }

    /**
     * @notice Get contribution amount by a contributor.
     */
    function getContributorAmount(
        uint256 _patientId,
        address _contributor
    ) public view returns (uint256) {
        return contributions[_patientId][_contributor];
    }

    /**
     * @notice List all contributors for an appeal.
     */
    function getContributors(
        uint256 _patientId
    ) public view returns (address[] memory) {
        return contributorsList[_patientId];
    }

    /**
     * @notice Check if an appeal's target is achieved.
     */
    function isTargetAchieved(uint256 _patientId) public view returns (bool) {
        return patientAppeals[_patientId].targetAchieved;
    }

    /** @dev Reject direct ETH transfers. */
    receive() external payable {
        revert("Use contributeToPatient");
    }

    /** @dev Reject unknown calls. */
    fallback() external payable {
        revert("Use contributeToPatient");
    }
}
