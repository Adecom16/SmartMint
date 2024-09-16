interface Token {
  id: number;
  tokenName: string;
  tokenSymbol: string;
  tokenPrice: string;
  tokenSupply: string;
  address: string;
}

export const tableData: Token[] = [
    {
        id: 1,
        tokenName: "Bitcoin",
        tokenSymbol: "BTC",
        tokenPrice: "50000",
        tokenSupply: "21000000",
        address: "0x1234567890abcdef",
    },
    {
        id: 2,
        tokenName: "Ethereum",
        tokenSymbol: "ETH",
        tokenPrice: "4000",
        tokenSupply: "115000000",
        address: "0xabcdef1234567890",
    },
];
