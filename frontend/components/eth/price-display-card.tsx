"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import fetchEthPrice from "@/lib/fetchEthPrice"
import type { PriceData, TokenPrice } from "@/types"
import PriceTable from "@/components/eth/price-table"

const PriceDisplayCard = () => {
	const [data, setData] = useState<PriceData[]>([])
	const [lastUpdated, setLastUpdated] = useState(new Date())
	const [isLoading, setIsLoading] = useState(false)

	const updatePriceData = async () => {
		setIsLoading(true)
		const tokenPrices = await fetchEthPrice()
		if (!tokenPrices) return setIsLoading(false)

		const now = new Date()
		const currentHour = now.getHours()

		setData((prevData) => {
			const last = prevData.at(-1)
			const lastHour = last ? Number.parseInt(last.hour24.split(":")[0]) : null
			if (lastHour === currentHour) return prevData

			const time = now.toLocaleTimeString("en-US", {
				hour: "2-digit",
				minute: "2-digit",
				hour12: true,
			})

			const hour24 = now.toLocaleTimeString("en-US", {
				hour: "2-digit",
				minute: "2-digit",
				hour12: false,
			})

			const newTokens: TokenPrice[] = tokenPrices
				.filter((t) => t.symbol !== "BTC")
				.map((t) => {
					const prev = last?.tokens.find((x) => x.symbol === t.symbol)
					const prevPrice = prev?.price ?? t.price
					const change = ((t.price - prevPrice) / prevPrice) * 100
					return { ...t, change }
				})

			const updated = [...prevData]
			if (updated.length >= 24) updated.shift()
			updated.push({ time, hour24, tokens: newTokens })
			setLastUpdated(now)
			return updated
		})
		setIsLoading(false)
	}

	useEffect(() => {
		updatePriceData()
		const interval = setInterval(updatePriceData, 60 * 60 * 1000)
		return () => clearInterval(interval)
	}, [])

	const displayPrice = (price: number) =>
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 2,
		}).format(price)

	const getTokenImageSrc = (symbol: string) => {
		switch (symbol) {
			case "ETH":
				return "/assets/ethereum.png"
			case "USDC":
				return "/assets/usdc.png"
			default:
				return "/assets/token.png"
		}
	}

	return (
		<div className="container mx-auto p-6 space-y-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Ethereum and USDC Price Tracker
					</h1>
					<p className="text-muted-foreground">
						Real-time ETH and USDC prices via Alchemy API
					</p>
				</div>
				<div className="flex items-center gap-4">
					<div className="text-sm text-muted-foreground">
						Last updated: {lastUpdated.toLocaleTimeString()}
					</div>
					<Button
						onClick={updatePriceData}
						variant="outline"
						size="sm"
						disabled={isLoading}
					>
						<RefreshCw
							className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
						/>
						{isLoading ? "Updating..." : "Refresh"}
					</Button>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
				{["ETH", "USDC"].map((symbol) => {
					const current =
						data.at(-1)?.tokens.find((t) => t.symbol === symbol)?.price ?? 0
					const prices = data
						.map((d) => d.tokens.find((t) => t.symbol === symbol)?.price || 0)
						.filter((p) => p > 0)
					return (
						<Card key={symbol}>
							<CardHeader className="pb-3">
								<CardTitle className="flex items-center gap-2">
									<Image
										src={getTokenImageSrc(symbol)}
										alt={symbol}
										width={24}
										height={24}
										className="rounded-full"
									/>
									{symbol === "ETH" ? "Ethereum (ETH)" : "USD Coin (USDC)"}
								</CardTitle>
								<CardDescription>Current 24-hour price range</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									<div className="flex justify-between">
										<span className="text-sm text-muted-foreground">
											Current:
										</span>
										<span className="font-semibold">
											{displayPrice(current)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm text-muted-foreground">
											24h High:
										</span>
										<span className="font-semibold">
											{prices.length > 0
												? displayPrice(Math.max(...prices))
												: "N/A"}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm text-muted-foreground">
											24h Low:
										</span>
										<span className="font-semibold">
											{prices.length > 0
												? displayPrice(Math.min(...prices))
												: "N/A"}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
					)
				})}
			</div>
			<PriceTable data={data} />
		</div>
	)
}

export default PriceDisplayCard
