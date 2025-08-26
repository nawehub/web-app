"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useToast} from "@/hooks/use-toast";
import {useSession} from "next-auth/react";

export default function SettingsPage() {
    const {data: session} = useSession({
        required: true,
    });
    const [isSaving, setIsSaving] = useState(false);
    const {toast} = useToast();
    const [user, setUser] = useState({
        id: session?.user?.id || "",
        firstName: session?.user?.firstName || "",
        lastName: session?.user?.lastName || "",
        email: session?.user?.email || "",
        phone: session?.user?.phone || "",
        gender: session?.user?.gender || "",
    });

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast({
                title: "Settings saved",
                description: "Your preferences have been updated successfully.",
            });
        }, 1000);
    };

    return (
        <div className="space-y-6 mt-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences
                </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="account">Account</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Update your personal information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First name</Label>
                                    <Input id="firstName" value={user.firstName}
                                           onChange={(e) => setUser((prev) => ({...prev, firstName: e.target.value}))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last name</Label>
                                    <Input id="lastName"
                                           value={user.lastName}
                                           onChange={(e) => setUser((prev) => ({...prev, lastName: e.target.value}))}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" disabled type="email" defaultValue={user.email}/>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone number</Label>
                                <Input id="phone" type="tel" value={user.phone}
                                       onChange={(e) => setUser((prev) => ({...prev, phone: e.target.value}))}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving ? "Saving..." : "Save changes"}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="account" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Password</CardTitle>
                            <CardDescription>
                                Update your password
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Current password</Label>
                                <Input id="currentPassword" type="password"/>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New password</Label>
                                <Input id="newPassword" type="password"/>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm password</Label>
                                <Input id="confirmPassword" type="password"/>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving ? "Updating..." : "Update password"}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}