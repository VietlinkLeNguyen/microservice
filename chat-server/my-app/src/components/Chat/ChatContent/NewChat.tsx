import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { IUser } from '@/type/login'
import { Check, X } from 'lucide-react'
import { useEffect, useState } from 'react'


type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
}
export function NewChat({ onOpenChange, open }: Props) {
    const [selectedUsers, setSelectedUsers] = useState<IUser[]>([])
    const [users, setUsers] = useState<IUser[]>([])

    const handleSelectUser = (user: IUser) => {
        if (!selectedUsers.find((u) => u._id === user._id)) {
            setSelectedUsers([...selectedUsers, user])
        } else {
            handleRemoveUser(user._id)
        }
    }

    const handleRemoveUser = (userId: string) => {
        setSelectedUsers(selectedUsers.filter((user) => user._id !== userId))
    }

    useEffect(() => {
        if (!open) {
            setSelectedUsers([])
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='sm:max-w-[600px]'>
                <DialogHeader>
                    <DialogTitle>New message</DialogTitle>
                </DialogHeader>
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-wrap items-center gap-2'>
                        <span className='text-muted-foreground text-sm'>To:</span>
                        {selectedUsers.map((user) => (
                            <Badge key={user._id} variant='default'>
                                {user.name}
                                <button
                                    className='ring-offset-background focus:ring-ring ml-1 rounded-full outline-hidden focus:ring-2 focus:ring-offset-2'
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleRemoveUser(user._id)
                                        }
                                    }}
                                    onClick={() => handleRemoveUser(user._id)}
                                >
                                    <X className='text-muted-foreground hover:text-foreground h-3 w-3' />
                                </button>
                            </Badge>
                        ))}
                    </div>
                    <Command className='rounded-lg border'>
                        <CommandInput
                            placeholder='Search people...'
                            className='text-foreground'
                        />
                        <CommandList>
                            <CommandEmpty>No people found.</CommandEmpty>
                            <CommandGroup>
                                {users.map((user) => (
                                    <CommandItem
                                        key={user._id}
                                        onSelect={() => handleSelectUser(user)}
                                        className='flex items-center justify-between gap-2'
                                    >
                                        <div className='flex items-center gap-2'>
                                            <img
                                                src={'/placeholder.svg'}
                                                alt={user.name}
                                                className='h-8 w-8 rounded-full'
                                            />
                                            <div className='flex flex-col'>
                                                <span className='text-sm font-medium'>
                                                    {user.name}
                                                </span>
                                                <span className='text-muted-foreground text-xs'>
                                                    {user.email}
                                                </span>
                                            </div>
                                        </div>

                                        {selectedUsers.find((u) => u._id === user._id) && (
                                            <Check className='h-4 w-4' />
                                        )}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                    <Button
                        variant={'default'}
                        disabled={selectedUsers.length === 0}
                    >
                        Chat
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}