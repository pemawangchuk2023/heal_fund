export default async function fetchEthPrice(): Promise<
	{ symbol: string; price: number }[] | null
> {
	try {
		const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
		if (!apiKey) {
			console.error(
				"Missing NEXT_PUBLIC_ALCHEMY_API_KEY in environment variables."
			);
			return null;
		}

		const response = await fetch(
			"https://api.g.alchemy.com/prices/v1/tokens/by-symbol?symbols=ETH&symbols=USDC",
			{
				method: "GET",
				headers: {
					accept: "application/json",
					Authorization: `Bearer ${apiKey}`,
				},
			}
		);

		if (!response.ok) {
			console.error(
				"API request failed:",
				response.status,
				response.statusText
			);
			return null;
		}

		const data = await response.json();

		if (!Array.isArray(data?.data)) {
			console.error("Unexpected API structure:", data);
			return null;
		}

		type Token = {
			symbol: string;
			prices?: { value: string }[];
		};

		const result = data.data
			.map((token: Token) => {
				const rawPrice = token?.prices?.[0]?.value;
				const price = parseFloat(rawPrice ?? "");

				if (!token.symbol || isNaN(price)) {
					console.warn(`Skipping token due to invalid data:`, token);
					return null;
				}

				return { symbol: token.symbol, price };
			})
			.filter(
				(
					item: { symbol: string; price: number } | null
				): item is { symbol: string; price: number } => item !== null
			);

		return result.length > 0 ? result : null;
	} catch (error) {
		console.error("Error fetching token prices:", error);
		return null;
	}
}
