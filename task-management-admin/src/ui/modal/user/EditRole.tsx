'use client'

import { useAppDispatch } from '@/hooks/reduxHooks'
import { updateUsers } from '@/redux/actions/userAction'
import { Dialog, Transition } from '@headlessui/react'
import { Edit } from 'lucide-react'
import { Fragment, useState, MouseEvent } from 'react'

interface User {
  _id: string;
  // Add other user properties here if needed
}

interface EditProps {
  user: User
}

export default function EditRole({ user }: EditProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [role, setRole] = useState('user')
  const dispatch = useAppDispatch()

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  const roleChangeHandler = (e: MouseEvent<HTMLButtonElement>, userId: string) => {
    e.preventDefault()
    dispatch(updateUsers(userId, role))
    closeModal()
  }

  return (
    <>
      <div>
        <button
          type="button"
          className='mt-1 cursor-pointer'
          onClick={openModal}
        >
          <Edit />
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Change Role
                  </Dialog.Title>
                  <div className="mt-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          id="role-admin"
                          name="role"
                          type="radio"
                          className="h-4 w-4 cursor-pointer text-indigo-600 focus:ring-indigo-500"
                          onChange={() => setRole('admin')}
                          checked={role === 'admin'}
                        />
                        <label
                          htmlFor="role-admin"
                          className="ml-3 block text-sm font-medium text-gray-700"
                        >
                          Admin
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="role-editor"
                          name="role"
                          type="radio"
                          onChange={() => setRole('manager')}
                          className="h-4 w-4 cursor-pointer text-indigo-600 focus:ring-indigo-500"
                          checked={role === 'manager'}
                        />
                        <label
                          htmlFor="role-editor"
                          className="ml-3 block text-sm font-medium text-gray-700"
                        >
                          Manager
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="role-viewer"
                          name="role"
                          type="radio"
                          onChange={() => setRole('user')}
                          className="h-4 w-4 cursor-pointer text-indigo-600 focus:ring-indigo-500"
                          checked={role === 'user'}
                        />
                        <label
                          htmlFor="role-viewer"
                          className="ml-3 block text-sm font-medium text-gray-700"
                        >
                          User
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                      onClick={(e) => roleChangeHandler(e, user._id)}
                    >
                      Save
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}