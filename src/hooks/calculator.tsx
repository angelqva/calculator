import { useCallback, useState } from "react";
import { Span } from "@/types/Span";
const defaultInit: Span = {
	id: 0,
	type: "number",
	value: "0",
};
export const useCalculator = () => {
	const [displaySpans, setDisplaySapns] = useState<Span[]>([defaultInit]);
	const [lastOperation, setLastOperation] = useState<Span[]>([]);
	const [history, setHistory] = useState<Span[][]>([]);
	const [showHistory, setShowHistory] = useState(false);
	const getLastSpan = (): Span => {
		return displaySpans[displaySpans.length - 1];
	};
	const clickNumbers = useCallback(
		(number: string) => {
			const current = getLastSpan();
			if (current.type === "number") {
				let newValue = `${current.value}${number}`;
				if (current.value === "0") {
					newValue = `${number}`;
				}
				const spans = [...displaySpans];
				spans[current.id] = { ...current, value: newValue };
				setDisplaySapns(spans);
			} else {
				setDisplaySapns([...displaySpans, { id: displaySpans.length, type: "number", value: number }]);
			}
		},
		[displaySpans, setDisplaySapns, getLastSpan],
	);

	const clickOperations = useCallback(
		(operation: string) => {
			const current = getLastSpan();
			if (current.type === "number") {
				setDisplaySapns([...displaySpans, { id: displaySpans.length, type: "operation", value: operation }]);
			} else {
				const spans = [...displaySpans];
				spans[current.id] = { ...current, value: operation };
				setDisplaySapns(spans);
			}
		},
		[displaySpans, setDisplaySapns, getLastSpan],
	);
	const calcResult = useCallback(() => {
		let arrOperations = [...displaySpans];
		const current = getLastSpan();
		if (current.value.length === 0 && arrOperations.length > 2) {
			arrOperations = arrOperations.slice(0, arrOperations.length - 2);
		}
		if (arrOperations.length > 2) {
			if (arrOperations.length % 2 === 0) {
				arrOperations = arrOperations.slice(0, arrOperations.length - 1);
			}
			const getOrder = (operations: Span[]) => {
				return operations
					.filter((el) => el.type === "operation")
					.sort((a, b) => {
						const aMultDiv = a.value === "x" || a.value === "÷" ? 1 : 0;
						const bMultDiv = b.value === "x" || b.value === "÷" ? 1 : 0;
						return bMultDiv - aMultDiv;
					});
			};

			const doClac = (order: Span[], operations: Span[]): Span[] => {
				if (order.length > 0) {
					const current = order[0];
					const newOpStart = operations.slice(0, current.id - 1);
					const newOpEnd = operations.slice(current.id + 2, operations.length);
					const leftOperand = Number(operations[current.id - 1].value);
					const rightOperand = Number(operations[current.id + 1].value);
					let resultValue: Number;
					switch (current.value) {
						case "-":
							resultValue = leftOperand - rightOperand;
							break;
						case "x":
							resultValue = leftOperand * rightOperand;
							break;
						case "÷":
							resultValue = leftOperand / rightOperand;
							break;
						default:
							resultValue = leftOperand + rightOperand;
							break;
					}
					const newNumber: Span = { id: newOpStart.length, type: "number", value: `${resultValue}` };
					console.log(newOpEnd);
					const newOperations = newOpStart.concat([newNumber]).concat(newOpEnd.map((el, index) => ({ ...el, id: newNumber.id + index + 1 })));
					const newOrder = getOrder(newOperations);
					return doClac(newOrder, newOperations);
				} else {
					return operations;
				}
			};
			const newDisplaySpans = doClac(getOrder(arrOperations), arrOperations);
			setLastOperation(arrOperations);
			setHistory([...history, arrOperations.concat([{ id: arrOperations.length, type: "number", value: ` = ${newDisplaySpans[0].value}` }])]);
			setDisplaySapns(newDisplaySpans);
		} else {
			setDisplaySapns([displaySpans[0]]);
		}
	}, [getLastSpan, displaySpans, history, setLastOperation, setHistory, setDisplaySapns]);
	const clickDot = useCallback(() => {
		const current = getLastSpan();
		if (current.type === "number") {
			if (!current.value.includes(".")) {
				const spans = [...displaySpans];
				spans[current.id] = { ...current, value: `${current.value}.` };
				setDisplaySapns(spans);
			}
		}
	}, [displaySpans, setDisplaySapns, getLastSpan]);
	const clickClear = useCallback(() => {
		setLastOperation([]);
		setDisplaySapns([defaultInit]);
	}, [setLastOperation, setDisplaySapns]);
	const clickClearLast = useCallback(() => {
		const current = getLastSpan();
		const spans = [...displaySpans];
		if (current.type === "operation") {
			setDisplaySapns(spans.slice(0, spans.length - 1));
		} else {
			if (current.value.length === 0 && spans.length > 2) {
				setDisplaySapns(spans.slice(0, spans.length - 2));
			} else if (spans.length === 1 && current.value.length === 1 && current.value !== "0") {
				spans[current.id].value = "0";
				setDisplaySapns(spans);
			} else if (current.value.length > 0 && current.value.length !== 1) {
				spans[current.id].value = current.value.slice(0, current.value.length - 1);
				setDisplaySapns(spans);
			}
		}
	}, [displaySpans, setDisplaySapns, getLastSpan]);
	const clickPercent = useCallback(() => {
		const current = getLastSpan();
		if (current.type === "number") {
			const val = Number(current.value);
			const result = val / 100;
			const newValue = Math.round(result * 100) / 100;
			const spans = [...displaySpans];
			spans[current.id] = { ...current, value: `${newValue}` };
			setDisplaySapns(spans);
		}
	}, [displaySpans, setDisplaySapns, getLastSpan]);
	const clickSign = useCallback(() => {
		const current = getLastSpan();
		if (current.type === "number") {
			const newValue = Number(current.value) * -1;
			const spans = [...displaySpans];
			spans[current.id] = { ...current, value: `${newValue}` };
			setDisplaySapns(spans);
		}
	}, [displaySpans, setDisplaySapns, getLastSpan]);
	const clearHistory = useCallback(() => {
		setHistory([]);
	}, [setHistory]);
	return {
		displaySpans,
		lastOperation,
		history,
		showHistory,
		setShowHistory,
		clickNumbers,
		clickOperations,
		calcResult,
		clickDot,
		clickClear,
		clickClearLast,
		clickPercent,
		clickSign,
		clearHistory,
	};
};
