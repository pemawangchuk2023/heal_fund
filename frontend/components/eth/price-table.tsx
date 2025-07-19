"use client"

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import type { PriceData } from "@/types"

const displayPrice = (price: number) =>
	new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(price)

const formatPercentage = (percent: number) =>
	`${percent >= 0 ? "+" : ""}${percent.toFixed(2)}%`

const getChangeBadgeVariant = (
	change: number
): "default" | "secondary" | "destructive" => {
	if (change > 0) return "default"
	if (change < 0) return "destructive"
	return "secondary"
}

type Props = {
	data: PriceData[]
}

const PriceTable = ({ data }: Props) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Hourly Price Data</CardTitle>
				<CardDescription>
					Complete hourly breakdown for ETH and USDC prices
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[100px]">Time</TableHead>
								<TableHead className="text-right">Ethereum (ETH)</TableHead>
								<TableHead className="text-right">ETH Change</TableHead>
								<TableHead className="text-right">USD Coin (USDC)</TableHead>
								<TableHead className="text-right">USDC Change</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.length > 0 ? (
								data.map((row, index) => {
									const ethToken = row.tokens.find((t) => t.symbol === "ETH")
									const usdcToken = row.tokens.find((t) => t.symbol === "USDC")
									return (
										<TableRow key={index} className="hover:bg-muted/50">
											<TableCell className="font-medium">
												<div className="flex flex-col">
													<span>{row.time}</span>
													<span className="text-xs text-muted-foreground">
														{row.hour24}
													</span>
												</div>
											</TableCell>
											<TableCell className="text-right font-semibold">
												{ethToken ? displayPrice(ethToken.price) : "N/A"}
											</TableCell>
											<TableCell className="text-right">
												<div className="flex items-center justify-end gap-1">
													{ethToken && ethToken.change > 0 ? (
														<TrendingUp className="h-3 w-3 text-green-600" />
													) : ethToken && ethToken.change < 0 ? (
														<TrendingDown className="h-3 w-3 text-red-600" />
													) : null}
													<Badge
														variant={
															ethToken
																? getChangeBadgeVariant(ethToken.change)
																: "secondary"
														}
														className="text-xs"
													>
														{ethToken
															? formatPercentage(ethToken.change)
															: "N/A"}
													</Badge>
												</div>
											</TableCell>
											<TableCell className="text-right font-semibold">
												{usdcToken ? displayPrice(usdcToken.price) : "N/A"}
											</TableCell>
											<TableCell className="text-right">
												<div className="flex items-center justify-end gap-1">
													{usdcToken && usdcToken.change > 0 ? (
														<TrendingUp className="h-3 w-3 text-green-600" />
													) : usdcToken && usdcToken.change < 0 ? (
														<TrendingDown className="h-3 w-3 text-red-600" />
													) : null}
													<Badge
														variant={
															usdcToken
																? getChangeBadgeVariant(usdcToken.change)
																: "secondary"
														}
														className="text-xs"
													>
														{usdcToken
															? formatPercentage(usdcToken.change)
															: "N/A"}
													</Badge>
												</div>
											</TableCell>
										</TableRow>
									)
								})
							) : (
								<TableRow>
									<TableCell colSpan={5} className="text-center py-4">
										Loading price data...
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	)
}

export default PriceTable
