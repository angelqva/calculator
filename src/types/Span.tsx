export type TypeSpan = "number" | "operation";
export interface Span {
	id: number;
	type: TypeSpan;
	value: string;
}
