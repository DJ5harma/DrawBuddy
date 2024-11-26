import { Dispatch, ReactNode, SetStateAction } from "react";

export default function PopUpWrapper({
	children,
	setShow,
	className,
}: {
	children: ReactNode;
	setShow: Dispatch<SetStateAction<boolean>>;
	className?: string;
}) {
	return (
		<div
			className="absolute left-0 top-0 w-screen h-screen flex items-center justify-center bg-opacity-50 bg-black z-50 cursor-pointer "
			onClick={() => setShow(false)}
			onMouseDown={(e) => e.stopPropagation()}
		>
			<div
				className={
					"bg-neutral-200 text-black flex flex-col gap-2 cursor-default p-4 w-fit h-fit" +
					" [&>*]:px-4 [&>*]:py-3 [&>p]:cursor-pointer [&>button]:bg-white text-blue-900 bg-gray-300 font-semibold " +
					className
				}
				onClick={(e) => e.stopPropagation()}
			>
				{children}
			</div>
		</div>
	);
}
