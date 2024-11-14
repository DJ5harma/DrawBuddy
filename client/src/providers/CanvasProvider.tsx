import {
	createContext,
	useRef,
	useEffect,
	ReactNode,
	useContext,
	useState,
} from "react";

const context = createContext<
	| {
			canvasRef: React.RefObject<HTMLCanvasElement>;
			ctx: CanvasRenderingContext2D | null;
	  }
	| undefined
>(undefined);

export default function CanvasProvider({ children }: { children: ReactNode }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		setCtx(canvas.getContext("2d"));
		const rect = canvas.getBoundingClientRect();
		canvas.width = rect.width;
		canvas.height = rect.height;
	}, []);

	return (
		<context.Provider value={{ canvasRef, ctx }}>
			<canvas
				ref={canvasRef}
				className="w-screen h-screen absolute left-0 top-0"
			/>
			{children}
		</context.Provider>
	);
}

export const useCanvas = () => useContext(context)!;
