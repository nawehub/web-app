import {motion} from "framer-motion";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {PlusCircleIcon} from "lucide-react";
import {Icons} from "@/components/ui/icon";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import React, {useState, useTransition} from "react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {CustomCombobox} from "@/components/ui/combobox";
import {CustomDatePicker} from "@/components/ui/date-picker";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {countries} from "@/utils/countries";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {registerBizForm} from "@/lib/services/business";
import {zodResolver} from "@hookform/resolvers/zod";
import {BusinessFormData, steps, initData, getDate15YearsAgo, categories, businessTypes} from "@/types/business";
import {useRouter} from "next/navigation";
import {RegisterResponse} from "@/store/auth";
import {useRegisterPublicBusinessMutation} from "@/hooks/repository/use-business";
import {toast} from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {DialogBody} from "next/dist/client/components/react-dev-overlay/ui/components/dialog";
import {Textarea} from "@/components/ui/textarea";
import {formatResponse} from "@/utils/format-response";

export default function RegisterForm() {
    const [isPending, startTransition] = useTransition()
    const [formData, setFormData] = useState<BusinessFormData>(initData)
    const router = useRouter()
    const register = useRegisterPublicBusinessMutation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [title, setTitle] = useState("Registering your business");
    const [typeDescription, setTypeDescription] = useState<string[]>([]);

    const form = useForm<z.infer<typeof registerBizForm>>({
        resolver: zodResolver(registerBizForm)
    });

    const updateFormData = (field: keyof BusinessFormData, value: any) => {
        setFormData((prev) => ({...prev, [field]: value}))
    }

    const handleSubmit = async (event: React.MouseEvent) => {
        event.preventDefault();
        setIsDialogOpen(true);
        startTransition(async () => {
            const data: z.infer<typeof registerBizForm> = {
                ...formData,
                dateOfBirth: new Date(formData.dateOfBirth),
                gender: formData.gender as z.infer<typeof registerBizForm>["gender"],
                isPublicRegister: true
            }
            try {
                const response: RegisterResponse = await register.mutateAsync(data);
                toast('Registration Successful',{
                    description: response.message,
                    className: "bg-green-500 text-white",
                    duration: 10000,
                });
                form.reset();
                setMessage(response.message);
                setTitle("Registration Successful");
            } catch (error) {
                toast('Registration failed',{
                    description: `${error instanceof Error ? formatResponse(error.message) : 'An unknown error occurred'}`,
                    className: "bg-red-500 text-white",
                });
            }
        });
    };

    const isStepValid = () => {
        return formData.businessName && formData.businessAddress && formData.businessActivities && formData.businessEntityType && formData.category && formData.ownerName && formData.ownerAddress && formData.placeOfBirth && formData.dateOfBirth
            && formData.nationality && formData.mothersName && formData.email && formData.contactNumber && formData.gender && formData.ninOrPassport;
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Business Registration</h1>
                <p className="text-muted-foreground"> Fill in the details below to register your new business</p>

                <Form {...form}>
                    <motion.form
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.3}}
                        className="space-y-4 mt-6"
                    >
                        <Card>
                            <CardHeader>
                                <div>
                                    <CardTitle>{steps[0].title}</CardTitle>
                                    <CardDescription>{steps[0].description}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 mt-3">
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
                                                        value={formData.businessName}
                                                        onChange={(e) => updateFormData('businessName', e.target.value)}
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
                                                    <Label htmlFor="category">Business Category</Label>
                                                    <CustomCombobox
                                                        {...field}
                                                        placeholder="Select your business category"
                                                        searchPlaceholder={'Search category...'}
                                                        data={categories}
                                                        searchField={'name'}
                                                        displayField={'name'}
                                                        valueField={'name'}
                                                        onSelectAction={(value) => {
                                                            updateFormData('category', value)
                                                            field.onChange(value)
                                                        }}/>
                                                </div>
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            name={'businessEntityType'}
                                            control={form.control}
                                            render={({field}) => (
                                                <div className="space-y-2">
                                                    <Label htmlFor="category">Business Entity Type</Label>
                                                    <CustomCombobox
                                                        {...field}
                                                        placeholder="Select your business category"
                                                        searchPlaceholder={'Search business entity type...'}
                                                        data={businessTypes}
                                                        searchField={'name'}
                                                        displayField={'name'}
                                                        valueField={'name'}
                                                        onSelectAction={(value) => {
                                                            updateFormData('businessEntityType', value)
                                                            field.onChange(value)
                                                            setTypeDescription(businessTypes.filter(type => {
                                                                return type.name == value
                                                            })[0].descriptions)
                                                        }}/>
                                                    {typeDescription.length > 0 && (
                                                        typeDescription.map((description, index) => (
                                                            <p key={index} className="text-muted-foreground text-xs">
                                                                 {description}
                                                             </p>
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                        />
                                        <FormField
                                            name={'businessAddress'}
                                            control={form.control}
                                            render={({field}) => (
                                                <div className="space-y-2">
                                                    <Label htmlFor="businessAddress">Business Address</Label>
                                                    <Textarea
                                                        id="businessAddress"
                                                        {...field}
                                                        value={formData.businessAddress}
                                                        onChange={(e) => updateFormData('businessAddress', e.target.value)}
                                                        required
                                                        rows={2}
                                                        placeholder="Enter business address"
                                                    />
                                                </div>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        name={'businessActivities'}
                                        control={form.control}
                                        render={({field}) => (
                                            <div className="space-y-2">
                                                <Label htmlFor="businessActivities">Business Activities</Label>
                                                <Textarea
                                                    id="businessActivities"
                                                    {...field}
                                                    value={formData.businessActivities}
                                                    onChange={(e) => updateFormData('businessActivities', e.target.value)}
                                                    required
                                                    placeholder="Enter business activities here..."
                                                    rows={6}
                                                />
                                                <p className="text-muted-foreground text-xs">
                                                    Please provide a brief description of your business activities.
                                                </p>
                                            </div>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div>
                                    <CardTitle>{steps[1].title}</CardTitle>
                                    <CardDescription>{steps[1].description}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 mt-3">
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
                                                        value={formData.ownerName}
                                                        onChange={(e) => updateFormData('ownerName', e.target.value)}
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
                                                                value={formData.placeOfBirth}
                                                                onChange={(e) => updateFormData('placeOfBirth', e.target.value)}
                                                                required
                                                                type={'text'}
                                                                placeholder="Enter business owner address"
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage/>
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
                                                                setDateAction={(e) => {
                                                                    field.onChange(e)
                                                                    updateFormData('dateOfBirth', e)
                                                                }}
                                                                isRequired={false}
                                                                isDisable={(date) =>
                                                                    date > getDate15YearsAgo() || date < new Date("1900-01-01")
                                                                }
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage/>
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
                                                                updateFormData('gender', e)
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
                                                        value={formData.ownerAddress}
                                                        onChange={(e) => updateFormData('ownerAddress', e.target.value)}
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
                                                        value={formData.contactNumber}
                                                        onChange={(e) => updateFormData('contactNumber', e.target.value)}
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
                                                        value={formData.email}
                                                        onChange={(e) => updateFormData('email', e.target.value)}
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
                                                        value={formData.mothersName}
                                                        onChange={(e) => updateFormData('mothersName', e.target.value)}
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
                                                        value={formData.nationality}
                                                        onSelectAction={(value) => {
                                                            field.onChange(value)
                                                            updateFormData('nationality', value)
                                                        }}/>
                                                </div>
                                            )}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <div>
                                    <CardTitle>{steps[2].title}</CardTitle>
                                    <CardDescription>{steps[2].description}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 mt-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            name={'ninOrPassport'}
                                            control={form.control}
                                            render={({field}) => (
                                                <div className="space-y-2">
                                                    <Label htmlFor="ninOrPassport">Nin/Passport *</Label>
                                                    <Input
                                                        id="ninOrPassport"
                                                        {...field}
                                                        value={formData.ninOrPassport}
                                                        onChange={(e) => updateFormData('ninOrPassport', e.target.value)}
                                                        type={'text'}
                                                        required
                                                        placeholder="Enter your NIN or PASSPORT number"
                                                    />
                                                </div>
                                            )}
                                        />

                                        <FormField
                                            name={'occupation'}
                                            control={form.control}
                                            render={({field}) => (
                                                <div className="space-y-2">
                                                    <Label htmlFor="occupation">Occupation </Label>
                                                    <Input
                                                        id="occupation"
                                                        {...field}
                                                        value={formData.occupation}
                                                        onChange={(e) => updateFormData('occupation', e.target.value)}
                                                        type={'text'}
                                                        required
                                                        placeholder="What is your occupation?"
                                                    />
                                                </div>
                                            )}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <div className="flex items-end justify-end space-x-2 mt-6">
                            <Button variant="outline" onClick={() => router.push("/")}>
                                Cancel
                            </Button>

                            <Button
                                onClick={(event) => handleSubmit(event)}
                                disabled={!isStepValid() || isPending}
                                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                                {isPending ? (
                                    <Icons.spinner className={'h-4 w-4 mr-2 animate-spin'}/>
                                ) : (
                                    <PlusCircleIcon className={'h-4 w-4 mr-2'}/>
                                )}
                                Register Business
                            </Button>
                        </div>
                    </motion.form>
                </Form>
            </motion.div>

            <Dialog open={isDialogOpen} modal={false}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className={"text-center"}>
                        <DialogTitle className="text-2xl font-medium text-center">{title}</DialogTitle>
                        <DialogDescription className={"text-center"}>
                            {isPending ? "Sit back and relax while we register your business. This may take a few seconds." : "Boom!! Your business is one step closer to completion"}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogBody>
                        <div className={"flex-1 items-center text-center"}>
                            {isPending ? (
                                <div className={"flex flex-col items-center justify-center space-y-4 mt-5 text-center"}>
                                    <Icons.spinner className={'h-7 w-7 mr-2 animate-spin'}/>
                                </div>
                            ) : (
                                <div className={"flex flex-col items-center justify-center space-y-4 mt-5"}>
                                    <div>
                                        <p className={"text-muted-foreground"}>{message}</p>
                                        <p className={"text-muted-foreground mb-5"}>Credentials to access the dashboard and track the status of your dashboard has been sent to your email</p>
                                    </div>
                                    <div className={"flex items-center justify-center space-x-4"}>
                                        <Button variant={"outline"} onClick={() => {
                                            setIsDialogOpen(false)
                                            router.push("/")
                                        }}>Go To Previous Page</Button>
                                        <Button onClick={() => {
                                            setIsDialogOpen(false)
                                            router.push('/login')
                                        }}>Sign In</Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </DialogBody>
                </DialogContent>
            </Dialog>
        </div>
    )
}