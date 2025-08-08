import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {motion} from "framer-motion";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import React, {useState, useTransition} from "react";
import {Plus, PlusCircleIcon} from "lucide-react";
import {useCreateProviderMutation} from "@/hooks/repository/use-funding";
import {createProviderForm} from "@/lib/services/funding";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useToast} from "@/hooks/use-toast";
import {Icons} from "@/components/ui/icon";

const providerTypes = ["Government", "NGO", "Private", "Foundation", "Bank", "Corporate", "Individual", "Other"]

export default function CreateProviderModal() {
    const [openModal, setOpenModal] = React.useState(false);
    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState(false);
    const {toast} = useToast();

    const createProvider = useCreateProviderMutation();
    const form = useForm<z.infer<typeof createProviderForm>>({
        resolver: zodResolver(createProviderForm),
        defaultValues: {
            name: '',
            description: '',
            websiteUrl: '',
            contactEmail: '',
            contactPhone: ''
        }
    })

    const isFormValid = () => {
        return (
            form.getValues("name").trim() &&
            form.getValues("description").trim() &&
            form.getValues("contactEmail").trim() &&
            form.getValues("contactPhone").trim() &&
            form.getValues("providerType") &&
            form.getValues("websiteUrl").trim()
        )
    }

    function handleSubmit(values: z.infer<typeof createProviderForm>) {
        setLoading(true);
        startTransition(async () => {
            try {
                const response = await createProvider.mutateAsync(values);
                toast({
                    title: 'Provider Created',
                    description: response.message,
                    variant: 'default',
                });
                form.reset();
                setOpenModal(false);
            } catch (error) {
                toast({
                    title: 'Registration failed',
                    description: `${error instanceof Error ? error.message : 'An unknown error occurred'}`,
                    variant: 'destructive',
                });
            } finally {
                setLoading(false);
            }
        })
    }

    return (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add Provider
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create New Funding Provider</DialogTitle>
                    <DialogDescription>Add a new funding provider to the platform</DialogDescription>
                </DialogHeader>
                <motion.div
                    initial={{opacity: 0, scale: 0.95}}
                    animate={{opacity: 1, scale: 1}}
                    className="space-y-4 py-4"
                >
                    <Form {...form}>
                        <motion.form
                            initial={{opacity: 0, y: 10}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.3}}
                            onSubmit={form.handleSubmit(handleSubmit)}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    name={"name"}
                                    control={form.control}
                                    render={({field}) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel htmlFor="name">Provider Name *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="name"
                                                    {...field}
                                                    placeholder="Enter provider name"
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name={"providerType"}
                                    control={form.control}
                                    render={({field}) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel htmlFor="provider_type">Provider Type *</FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={(value) => field.onChange(value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select provider type"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {providerTypes.map((type) => (
                                                            <SelectItem key={type} value={type}>
                                                                {type}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                name={"description"}
                                control={form.control}
                                render={({field}) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel htmlFor="description">Description *</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                id="description"
                                                {...field}
                                                placeholder="Provide a detailed description of the funding provider"
                                                rows={3}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    name={"contactEmail"}
                                    control={form.control}
                                    render={({field}) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel htmlFor="contact_email">Contact Email *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="contact_email"
                                                    type="email"
                                                    {...field}
                                                    placeholder="contact@provider.com"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name={"contactPhone"}
                                    control={form.control}
                                    render={({field}) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel htmlFor="contact_phone">Contact Phone *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="contact_phone"
                                                    {...field}
                                                    placeholder="+232 XX XXX XXX"
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                name={"websiteUrl"}
                                control={form.control}
                                render={({field}) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel htmlFor="website_url">Website URL</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="website_url"
                                                type="url"
                                                {...field}
                                                placeholder="https://www.provider.com"
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="outline" onClick={() => setOpenModal(false)}>
                                    Cancel
                                </Button>
                                <Button type={"submit"} disabled={!isFormValid() || isPending || loading}>
                                    {isPending || loading ? (
                                        <Icons.spinner className={'h-4 w-4 mr-2 animate-spin'} />
                                    ) : (
                                        <PlusCircleIcon className={'h-4 w-4 mr-2'} />
                                    )}
                                    Create Provider
                                </Button>
                            </div>
                        </motion.form>
                    </Form>
                </motion.div>
            </DialogContent>
        </Dialog>
    )
}