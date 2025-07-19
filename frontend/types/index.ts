export type TokenPrice = {
	symbol: string
	price: number
	change: number
}

export type PriceData = {
	time: string
	hour24: string
	tokens: TokenPrice[]
}
