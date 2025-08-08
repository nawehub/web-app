import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Plus, PlusCircleIcon} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useToast} from "@/hooks/use-toast";
import {useRegisterBusinessMutation} from "@/hooks/repository/use-business";
import {useState, useTransition} from "react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {motion} from "framer-motion";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {registerBizForm} from "@/lib/services/business";
import {zodResolver} from "@hookform/resolvers/zod";
import {RegisterResponse} from "@/store/auth";
import {CustomCombobox} from "@/components/ui/combobox";
import {countries} from "@/utils/countries";
import {categories} from "@/utils/business-categories";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";

import "react-datepicker/dist/react-datepicker.css";
import {CustomDatePicker} from "@/components/ui/date-picker";
import { Icons } from "@/components/ui/icon";

export const NewBizDialog = () => {
    const {toast} = useToast();
    const register = useRegisterBusinessMutation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof registerBizForm>>({
        resolver: zodResolver(registerBizForm),
    });

    const handleSubmit = async (values: z.infer<typeof registerBizForm>) => {
        setLoading(true);
        startTransition(async () => {
            try {
                const response: RegisterResponse = await register.mutateAsync({...values});
                toast({
                    title: 'Registration Successful',
                    description: response.message,
                    variant: 'default',
                });
                form.reset();
                setIsDialogOpen(false);
            } catch (error) {
                console.log({error})
                toast({
                    title: 'Registration failed',
                    description: `${error instanceof Error ? error.message : 'An unknown error occurred'}`,
                    variant: 'destructive',
                });
            } finally {
                setLoading(false);
            }
        });
    };

    function getDate15YearsAgo() {
        const currentDate = new Date(); // Get the current date and time
        const currentYear = currentDate.getFullYear(); // Get the current year

        // Set the year to 15 years ago
        currentDate.setFullYear(currentYear - 15);

        return currentDate; // Return the modified Date object
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <Plus className="h-4 w-4 mr-2"/>
                    Register New Business
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Register New Business</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to register your new business
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <motion.form
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.3}}
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4 mt-6"
                    >
                        <Tabs defaultValue="business" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="business">Business Information</TabsTrigger>
                                <TabsTrigger value="owner">Owner Information</TabsTrigger>
                            </TabsList>

                            <TabsContent value="business" className="space-y-4 mt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        name={'businessName'}
                                        control={form.control}
                                        render={({field}) => (
                                            <div className="space-y-2">
                                                <Label htmlFor="businessName">Business Name *</Label>
                                                <Input
                                                    id="businessName"
                                                    {...field}
                                                    type={'text'}
                                                    required
                                                    placeholder="Enter business name"
                                                />
                                            </div>
                                        )}
                                    />

                                    <FormField
                                        name={'category'}
                                        control={form.control}
                                        render={({field}) => (
                                            <div className="space-y-2">
                                                <Label htmlFor="category">Business Address</Label>
                                                <CustomCombobox
                                                    {...field}
                                                    placeholder="Select your business category"
                                                    searchPlaceholder={'Search category...'}
                                                    data={categories}
                                                    searchField={'name'}
                                                    displayField={'name'}
                                                    valueField={'name'}
                                                    {...field}
                                                    onSelectAction={(value) => {
                                                        field.onChange(value)
                                                    }}/>
                                            </div>
                                        )}
                                    />
                                </div>
                                <FormField
                                    name={'businessAddress'}
                                    control={form.control}
                                    render={({field}) => (
                                        <div className="space-y-2">
                                            <Label htmlFor="businessAddress">Business Address</Label>
                                            <Input
                                                id="businessAddress"
                                                {...field}
                                                required
                                                type={'text'}
                                                placeholder="Enter business address"
                                            />
                                        </div>
                                    )}
                                />
                            </TabsContent>

                            <TabsContent value="owner" className="space-y-4 mt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        name={'ownerName'}
                                        control={form.control}
                                        render={({field}) => (
                                            <div className="space-y-2">
                                                <Label htmlFor="ownerName">Owner Name *</Label>
                                                <Input
                                                    id="ownerName"
                                                    {...field}
                                                    required
                                                    type={'text'}
                                                    placeholder="Enter business owner name"
                                                />
                                            </div>
                                        )}
                                    />

                                    <FormField
                                        name={'placeOfBirth'}
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="placeOfBirth">Place of Birth *</Label>
                                                        <Input
                                                            id="placeOfBirth"
                                                            {...field}
                                                            required
                                                            type={'text'}
                                                            placeholder="Enter business owner address"
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        name={'dateOfBirth'}
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem className={'space-y-2'}>
                                                <FormLabel>Date of Birth *</FormLabel>
                                                <FormControl>
                                                    <div>
                                                        <CustomDatePicker
                                                            date={field.value}
                                                            setDateAction={field.onChange}
                                                            isRequired={false}
                                                            isDisable={(date) =>
                                                                date > getDate15YearsAgo() || date < new Date("1900-01-01")
                                                            }
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="gender"
                                        render={({field}) => (
                                            <FormItem>
                                                <Label>Gender → <br/> <span className={"text-xs pb-4"}>Select owner gender</span></Label>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={(e) => {
                                                            field.onChange(e)
                                                        }}
                                                        defaultValue={field.value}
                                                    >
                                                        {['Male', 'Female'].map((gender, index) => (
                                                            <div className='flex flex-row items-center space-x-3'
                                                                 key={index}>
                                                                <RadioGroupItem value={gender}/>
                                                                <Label htmlFor={gender} className='font-normal'>
                                                                    {gender}
                                                                </Label>
                                                            </div>
                                                        ))}
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <FormField
                                        name={'ownerAddress'}
                                        control={form.control}
                                        render={({field}) => (
                                            <div className="space-y-2">
                                                <Label htmlFor="ownerAddress">Owner Address *</Label>
                                                <Input
                                                    id="ownerAddress"
                                                    {...field}
                                                    required
                                                    type={'text'}
                                                    placeholder="Enter business owner address"
                                                />
                                            </div>
                                        )}
                                    />
                                </div>


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        name={'contactNumber'}
                                        control={form.control}
                                        render={({field}) => (
                                            <div className="space-y-2">
                                                <Label htmlFor="contactNumber">Owner's Contact Number *</Label>
                                                <Input
                                                    id="contactNumber"
                                                    {...field}
                                                    required
                                                    type={'text'}
                                                    placeholder="Enter contact number"
                                                />
                                            </div>
                                        )}
                                    />

                                    <FormField
                                        name={'email'}
                                        control={form.control}
                                        render={({field}) => (
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Owner Or Business Email *</Label>
                                                <Input
                                                    id="email"
                                                    {...field}
                                                    required
                                                    type={'text'}
                                                    placeholder="Enter email"
                                                />
                                            </div>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        name={'mothersName'}
                                        control={form.control}
                                        render={({field}) => (
                                            <div className="space-y-2">
                                                <Label htmlFor="mothersName">Mother's Name *</Label>
                                                <Input
                                                    id="mothersName"
                                                    {...field}
                                                    required
                                                    type={'text'}
                                                    placeholder="Enter mother's name"
                                                />
                                            </div>
                                        )}
                                    />

                                    <FormField
                                        name={'nationality'}
                                        control={form.control}
                                        render={({field}) => (
                                            <div className="space-y-2">
                                                <Label htmlFor="nationality">Owner's Nationality</Label>
                                                <CustomCombobox
                                                    {...field}
                                                    placeholder="Select your nationality"
                                                    searchPlaceholder={'Search country...'}
                                                    data={countries}
                                                    searchField={'name'}
                                                    displayField={'name'}
                                                    valueField={'name'}
                                                    {...field}
                                                    onSelectAction={(value) => {
                                                        field.onChange(value)
                                                    }}/>
                                            </div>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        name={'registerDate'}
                                        control={form.control}
                                        render={({field}) => (
                                            <div className="space-y-2">
                                                <Label htmlFor="registerDate">Register Date *</Label>
                                                <CustomDatePicker
                                                    date={field.value}
                                                    setDateAction={field.onChange}
                                                    isRequired={false}
                                                    isDisable={(date) =>
                                                        date > new Date() || date < new Date("1900-01-01")
                                                    }
                                                />
                                            </div>
                                        )}
                                    />
                                </div>
                            </TabsContent>
                        </Tabs>
                        <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                type={"submit"}
                                disabled={loading || isPending}
                                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                                {isPending || loading ? (
                                    <Icons.spinner className={'h-4 w-4 mr-2 animate-spin'} />
                                ) : (
                                    <PlusCircleIcon className={'h-4 w-4 mr-2'} />
                                )}
                                Register Business
                            </Button>
                        </div>
                    </motion.form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}