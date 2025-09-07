import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {ChevronLeft, ChevronRight, Plus, PlusCircleIcon} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useToast} from "@/components/ui/use-toast";
import {useRegisterBusinessMutation} from "@/hooks/repository/use-business";
import React, {useState, useTransition} from "react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {motion} from "framer-motion";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {registerBizForm} from "@/lib/services/business";
import {zodResolver} from "@hookform/resolvers/zod";
import {RegisterResponse} from "@/store/auth";
import {CustomCombobox} from "@/components/ui/combobox";
import {countries} from "@/utils/countries";
import {businessTypes, categories} from "@/types/business";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";

import "react-datepicker/dist/react-datepicker.css";
import {CustomDatePicker} from "@/components/ui/date-picker";
import {Icons} from "@/components/ui/icon";
import {Progress} from "@/components/ui/progress";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Checkbox} from "@/components/ui/checkbox";
import {steps, BusinessFormData, initData, getDate15YearsAgo} from "@/types/business";
import {Textarea} from "@/components/ui/textarea";
import {formatResponse} from "@/utils/format-response";

export const NewBizDialog = () => {
    const {toast} = useToast();
    const register = useRegisterBusinessMutation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState<BusinessFormData>(initData)
    const [typeDescription, setTypeDescription] = useState<string[]>([]);

    const form = useForm<z.infer<typeof registerBizForm>>({
        resolver: zodResolver(registerBizForm)
    });

    const updateFormData = (field: keyof BusinessFormData, value: any) => {
        setFormData((prev) => ({...prev, [field]: value}))
    }

    const nextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    function validateRegisterDate() {
        if (formData.isAlreadyRegistered) {
            return formData.registerDate !== null && formData.registerDate !== undefined && formData.registrationNumber !== null && formData.registrationNumber !== undefined;
        }
        return true;
    }

    const isStepValid = (step: number) => {
        switch (step) {
            case 1:
                return formData.businessName && formData.category && formData.businessAddress && formData.businessEntityType && formData.businessActivities
                    && validateRegisterDate()
            case 2:
                return formData.ownerName && formData.ownerAddress && formData.placeOfBirth && formData.dateOfBirth
                    && formData.nationality && formData.mothersName && formData.email && formData.contactNumber && formData.gender
            default:
                return false
        }
    }

    const handleSubmit = async () => {
        setLoading(true);
        startTransition(async () => {
            const data: z.infer<typeof registerBizForm> = {
                ...formData,
                dateOfBirth: new Date(formData.dateOfBirth),
                gender: formData.gender as z.infer<typeof registerBizForm>["gender"]
            }
            try {
                const response: RegisterResponse = await register.mutateAsync(data);
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
                    description: `${error instanceof Error ? formatResponse(error.message) : 'An unknown error occurred'}`,
                    variant: 'destructive',
                });
            } finally {
                setLoading(false);
            }
        });
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
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
                                        <Label htmlFor="category">Business Category *</Label>
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
                        <FormField
                            name={'businessAddress'}
                            control={form.control}
                            render={({field}) => (
                                <div className="space-y-2">
                                    <Label htmlFor="businessAddress">Business Address *</Label>
                                    <Input
                                        id="businessAddress"
                                        {...field}
                                        value={formData.businessAddress}
                                        onChange={(e) => updateFormData('businessAddress', e.target.value)}
                                        required
                                        type={'text'}
                                        placeholder="Enter business address"
                                    />
                                </div>
                            )}
                        />
                        <FormField
                            name={'businessEntityType'}
                            control={form.control}
                            render={({field}) => (
                                <div className="space-y-2">
                                    <Label htmlFor="category">Business Entity Type *</Label>
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                name={'isAlreadyRegistered'}
                                control={form.control}
                                render={() => (
                                    <div className="space-y-2">
                                        <Label htmlFor="isAlreadyRegistered">Is this business already registered</Label>
                                        <div className="flex items-center space-x-2">
                                            <div className={'flex items-center space-x-2'}>
                                                <Checkbox
                                                    id="isAlreadyRegistered"
                                                    checked={formData.isAlreadyRegistered}
                                                    onCheckedChange={(checked) => updateFormData("isAlreadyRegistered", true)}
                                                />
                                                <Label htmlFor="isAlreadyRegistered">Yes</Label>
                                            </div>
                                            <div className={'flex items-center space-x-2'}>
                                                <Checkbox
                                                    id="isAlreadyRegistered"
                                                    checked={!formData.isAlreadyRegistered}
                                                    onCheckedChange={(checked) => updateFormData("isAlreadyRegistered", false)}
                                                />
                                                <Label htmlFor="isAlreadyRegistered">No</Label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            />
                        </div>
                        {formData.isAlreadyRegistered && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    name={'registerDate'}
                                    control={form.control}
                                    render={({field}) => (
                                        <div className="space-y-2">
                                            <Label htmlFor="registerDate">Register Date *</Label>
                                            <CustomDatePicker
                                                date={field.value}
                                                setDateAction={(e) => {
                                                    field.onChange(e)
                                                    updateFormData('registerDate', e)
                                                }}
                                                isRequired={false}
                                                isDisable={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                            />
                                        </div>
                                    )}
                                />
                                <FormField
                                    name={'registrationNumber'}
                                    control={form.control}
                                    render={({field}) => (
                                        <div className="space-y-2">
                                            <Label htmlFor="registrationNumber">Registration Number *</Label>
                                            <Input
                                                id="registrationNumber"
                                                {...field}
                                                value={formData.registrationNumber}
                                                onChange={(e) => updateFormData('registrationNumber', e.target.value)}
                                                required
                                                type={'text'}
                                                placeholder="Enter business registration number"
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                        )}
                    </div>
                )
            case 2:
                return (
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
                                        <Label>Gender → <br/> <span
                                            className={"text-xs pb-4"}>Select owner gender</span></Label>
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
                                            {...field}
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
                )
            default:
                return null
        }
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

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium">
                        Step {currentStep} of {steps.length}
                    </span>

                        <span className="text-sm text-muted-foreground">
                        {Math.round((currentStep / steps.length) * 50)}% Complete
                    </span>
                    </div>
                    <Progress value={(currentStep / steps.length) * 50} className="h-2"/>
                </div>

                <Form {...form}>
                    <motion.form
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.3}}
                        className="space-y-4"
                    >
                        <Card>
                            <CardHeader>
                                <div>
                                    <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                                    <CardDescription>{steps[currentStep - 1].description}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {renderStepContent()}
                            </CardContent>
                        </Card>
                        <div className="flex justify-between mt-6">
                            <div className="flex space-x-2">
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                                    <ChevronLeft className="mr-2 h-4 w-4"/>
                                    Previous
                                </Button>
                            </div>

                            {currentStep === steps.length ? (
                                <Button
                                    onClick={() => handleSubmit()}
                                    disabled={!isStepValid(currentStep) || isPending || loading}
                                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                                    {isPending || loading ? (
                                        <Icons.spinner className={'h-4 w-4 mr-2 animate-spin'}/>
                                    ) : (
                                        <PlusCircleIcon className={'h-4 w-4 mr-2'}/>
                                    )}
                                    Register Business
                                </Button>
                            ) : (
                                <Button onClick={nextStep} disabled={!isStepValid(currentStep)}>
                                    Next
                                    <ChevronRight className="ml-2 h-4 w-4"/>
                                </Button>
                            )}
                        </div>
                    </motion.form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}