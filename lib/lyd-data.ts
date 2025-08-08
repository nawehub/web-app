export const paymentProviders = {
    Momo: [
        {id: "m17", name: "Orange Money", disabled: false},
        {id: "m18", name: "Afri Money", disabled: true},
        {id: "m19", name: "Qmoney", disabled: true},
    ],
    Bank: [
        {id: "rcb001", name: "Rokel Commercial Bank", disabled: true},
        {id: "slcb002", name: "Sierra Leone Commercial Bank", disabled: true},
        {id: "uba001", name: "United Bank for Africa", disabled: true},
        {id: "gtb001", name: "Guaranty Trust Bank", disabled: true}
    ],
    Card:
        [
            {id: "visa", name: "Visa", disabled: true},
            {id: "mastercard", name: 'Mastercard', disabled: true},
            {id: "american-express", name: "American Express", disabled: true}
        ]
    ,
}

export const currencies = [
    {code: "SLE", name: "Sierra Leone Leone", symbol: "Le", disabled: false},
    {code: "USD", name: "US Dollar", symbol: "$", disabled: true},
    {code: "GBP", name: "British Pound", symbol: "£", disabled: true},
    {code: "EUR", name: "Euro", symbol: "€", disabled: true},
]
