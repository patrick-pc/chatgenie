import { Dialog, Transition } from '@headlessui/react'
import { Fragment, ReactNode } from 'react'

export interface ModalProps {
  children: ReactNode
  title: string
  isActive: boolean
  onClose: () => void
  disableClose?: boolean
}

const Modal = ({ children, title, isActive, onClose, disableClose = false }: ModalProps) => {
  return (
    <Transition.Root show={isActive} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={() => {
          disableClose ? null : onClose()
        }}
      >
        <div className="flex h-full w-full items-end justify-center sm:items-center">
          {/* Overlay */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/50 transition-opacity" />
          </Transition.Child>

          {/* Content */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="w-full transform rounded-t-xl bg-[#212325] px-6 py-8 text-white shadow-xl transition-all sm:max-w-sm sm:rounded-xl">
              <div className="mb-6 flex select-none items-center justify-between">
                <button className="invisible text-zinc-500 transition hover:text-zinc-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="text-lg font-medium">{title}</div>
                <button
                  className={`text-zinc-500 transition hover:text-zinc-400 ${
                    disableClose ? 'invisible' : 'visible'
                  }`}
                  onClick={onClose}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default Modal
