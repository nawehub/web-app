import React from "react";
import {Banknote, CreditCard, Smartphone} from "lucide-react";

export type PaymentMethod = 'mobile-money' | 'card' | 'bank-transfer'

export const paymentMethods: { id: PaymentMethod; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    {id: 'mobile-money', label: 'Mobile Money', icon: Smartphone},
    {id: 'card', label: 'Card', icon: CreditCard},
    {id: 'bank-transfer', label: 'Bank Transfer', icon: Banknote},
]