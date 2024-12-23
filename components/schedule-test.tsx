import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
    Dialog, 
    DialogContent, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createBrowserClient } from '@supabase/ssr';
//import { Toast } from "@/components/ui/toast";

// Create Supabase client once, outside component
const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Suite = {
    id: string; 
    name: string;
}

interface Schedule {
    test_name: string;
    start_date: string;
    weekly_schedule: string;
    user_id: string;
}

interface ScheduleTestProps {
    isOpen: boolean;
    onClose: () => void;
    suites: Suite[]; 
}

const ScheduleTest: React.FC<ScheduleTestProps> = ({ isOpen, onClose, suites }) => {
    const [testName, setTestName] = useState('');
    const [testDate, setTestDate] = useState('');
    const [testTime, setTestTime] = useState('');
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    //const { toast } = Toast();

    const handleTestNameChange = (value: string) => {
        setTestName(value);
    };

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const toggleDay = (day: string) => {
        setSelectedDays(prev => 
            prev.includes(day) 
                ? prev.filter(d => d !== day)
                : [...prev, day]
        );
    };

    const validateForm = (): string | null => {
        if (!testName) return "Please select a test suite";
        if (!testDate) return "Please select a start date";
        if (!testTime) return "Please select a start time";
        if (selectedDays.length === 0) return "Please select at least one day for weekly schedule";
        
        const startDateTime = new Date(`${testDate}T${testTime}`);
        if (startDateTime < new Date()) return "Start date and time must be in the future";
        
        return null;
    };

    const resetForm = () => {
        setTestName('');
        setTestDate('');
        setTestTime('');
        setSelectedDays([]);
    };

    const handleSubmit = async () => {
        const validationError = validateForm();
        if (validationError) {
            /* toast({
                title: "Validation Error",
                description: validationError,
                variant: "destructive"
            }); */
            return;
        }

        try {
            setIsLoading(true);
            
            const startDateTime = new Date(`${testDate}T${testTime}`);
            const { data: { user } } = await supabase.auth.getUser();
						console.log(user)
            
            if (!user) {
                /* toast({
                    title: "Authentication Error",
                    description: "Please sign in to create a schedule",
                    variant: "destructive"
                }); */
                return;
            }

            const schedule: Schedule = {
                test_name: testName,
                start_date: startDateTime.toISOString(),
                weekly_schedule: selectedDays.join(','),
                user_id: user.id
            };
						console.log(schedule)

            const { error } = await supabase
                .from('scheduled_tests')
                .insert(schedule);

            if (error) {
                throw error;
            }

            /* toast({   
                title: "Success",
                description: "Schedule created successfully",
            }); */

            resetForm();
            onClose();

        } catch (error) {
            console.error('Error saving schedule:', error);
            /* toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to save schedule",
                variant: "destructive"
            }); */
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-base font-semibold">Schedule Detail</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button 
                                    className="w-full justify-between bg-white hover:bg-gray-50" 
                                    variant="outline"
                                >
                                    {testName || 'Test Suite'}
                                    <span className="text-gray-500">▼</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-[550px]">
                                <DropdownMenuLabel>Test Suite</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={testName} onValueChange={handleTestNameChange}>
                                    {suites.map((suite) => (
                                        <DropdownMenuRadioItem key={suite.id} value={suite.name}>
                                            {suite.name}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="space-y-2">
                            <Label>Start Date and Time</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="date"
                                    value={testDate}
                                    onChange={(e) => setTestDate(e.target.value)}
                                    className="flex-1"
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                                <Input
                                    type="time"
                                    value={testTime}
                                    onChange={(e) => setTestTime(e.target.value)}
                                    className="flex-1"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Run Weekly on Every</Label>
                            <div className="flex gap-2">
                                {weekDays.map((day) => (
                                    <Button
                                        key={day}
                                        type="button"
                                        variant={selectedDays.includes(day) ? "default" : "outline"}
                                        className={`px-3 py-2 h-auto ${
                                            selectedDays.includes(day)
                                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                                : "bg-white hover:bg-gray-50"
                                        }`}
                                        onClick={() => toggleDay(day)}
                                    >
                                        {day}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter className="flex justify-between sm:justify-between">
                    <Button 
                        variant="outline" 
                        onClick={onClose}
                        className="bg-white hover:bg-gray-50"
                        disabled={isLoading}
                        type="button"
                    >
                        Cancel Schedule
                    </Button>
                    <Button 
                        onClick={handleSubmit}
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={isLoading}
                        type="button"
                    >
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ScheduleTest;


/* import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
    Dialog, 
    DialogContent, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createBrowserClient } from '@supabase/ssr';

type Suite = {
    id: string; 
    name: string;
}

interface ScheduleTestProps {
    isOpen: boolean;
    onClose: () => void;
    suites: Suite[]; 
}

const ScheduleTest: React.FC<ScheduleTestProps> = ({ isOpen, onClose, suites }) => {
    const [testName, setTestName] = useState('');
    const [testDate, setTestDate] = useState('');
    const [testTime, setTestTime] = useState('');
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
		const [isLoading, setIsLoading] = useState(false);

		const supabase = createBrowserClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
		);

    const handleTestNameChange = (value: string) => {
        setTestName(value);
    };

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Sat'];

    const toggleDay = (day: string) => {
			setSelectedDays(prev => 
				prev.includes(day) 
					? prev.filter(d => d !== day)
					: [...prev, day]
			);
    };

		const handleSubmit = async () => {
			try {
				setIsLoading(true); 
				const startDateTime = new Date(`${testDate}T${testTime}`);
				const { data: { user } } = await supabase.auth.getUser();
				if (!user) {
					throw new Error('No user found');
				}

				const { error } = await supabase
					.from('schedules')
					.insert({
							test_name: testName,
							start_date: startDateTime.toISOString(),
							weekly_schedule: selectedDays.join(','),
							user_id: user.id
					});

				if (error) {
					throw error;
				}

				setTestName('');
				setTestDate('');
				setTestTime('');
				setSelectedDays([]);
				onClose();

				console.log(user)
			}
			catch (error) {
				console.error('Error saving schedule:', error);
			}
			finally {
				setIsLoading(false);
			}
		} 

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-base font-semibold">Schedule Detail</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button 
                                    className="w-full justify-between bg-white hover:bg-gray-50" 
                                    variant="outline"
                                >
                                    {testName || 'Test Suite'}
                                    <span className="text-gray-500">▼</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-[550px]">
                                <DropdownMenuLabel>Test Suite</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={testName} onValueChange={handleTestNameChange}>
                                    {suites.map((suite) => (
                                        <DropdownMenuRadioItem key={suite.id} value={suite.name}>
                                            {suite.name}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="space-y-2">
                            <Label>Start Date and Time</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="date"
                                    value={testDate}
                                    onChange={(e) => setTestDate(e.target.value)}
                                    className="flex-1"
                                />
                                <Input
                                    type="time"
                                    value={testTime}
                                    onChange={(e) => setTestTime(e.target.value)}
                                    className="flex-1"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Run Weekly on Every</Label>
                            <div className="flex gap-2">
                                {weekDays.map((day) => (
                                    <Button
                                        key={day}
                                        variant={selectedDays.includes(day) ? "default" : "outline"}
                                        className={`px-3 py-2 h-auto ${
                                            selectedDays.includes(day)
                                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                                : "bg-white hover:bg-gray-50"
                                        }`}
                                        onClick={() => toggleDay(day)}
                                    >
                                        {day}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter className="flex justify-between sm:justify-between">
                    <Button 
                        variant="outline" 
                        onClick={onClose}
                        className="bg-white hover:bg-gray-50"
                    >
                        Cancel Schedule
                    </Button>
                    <Button 
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700"
												onClick={handleSubmit}
                    >
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ScheduleTest; */