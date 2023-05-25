import { useEffect, useRef, useState } from "react";
import "./App.scss";

console.log("[App.tsx]", `Hello world from Electron ${process.versions.electron}!`);
type TypeSpan = "number" | "operation";
interface Span {
	id: number;
	type: TypeSpan;
	value: string;
}
const defaultInit: Span = {
	id: 0,
	type: "number",
	value: "0",
};
function App() {
	const resultElement = useRef<HTMLDivElement | null>(null);
	const historyModal = useRef<HTMLDivElement | null>(null);
	const [displaySpans, setDisplaySapns] = useState<Span[]>([defaultInit]);
	const [lastOperation, setLastOperation] = useState<Span[]>([]);
	const [history, setHistory] = useState<Span[][]>([]);
	const setScrollToEnd = () => {
		if (resultElement.current) {
			const resultDiv = resultElement.current;
			if (resultDiv.scrollHeight > resultDiv.clientHeight) {
				resultDiv.scrollTo({
					top: resultDiv.scrollHeight,
					behavior: "smooth",
				});
			}
		}
	};
	const getLastSpan = (): Span => {
		return displaySpans[displaySpans.length - 1];
	};

	const handleNumbers = (number: string) => {
		const current: Span = getLastSpan();
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
	};
	const handleOperations = (operation: string) => {
		const current = getLastSpan();
		if (current.type === "number") {
			setDisplaySapns([...displaySpans, { id: displaySpans.length, type: "operation", value: operation }]);
		} else {
			const spans = [...displaySpans];
			spans[current.id] = { ...current, value: operation };
			setDisplaySapns(spans);
		}
	};
	const handleResult = () => {
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
					const current: Span = order[0];
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
	};
	const handleDot = () => {
		const current = getLastSpan();
		if (current.type === "number") {
			if (!current.value.includes(".")) {
				const spans = [...displaySpans];
				spans[current.id] = { ...current, value: `${current.value}.` };
				setDisplaySapns(spans);
			}
		}
	};
	const handleClear = () => {
		setLastOperation([]);
		setDisplaySapns([defaultInit]);
	};
	const handleClearLast = () => {
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
	};
	const handlePercent = () => {
		const current: Span = getLastSpan();
		if (current.type === "number") {
			const val = Number(current.value);
			const result = val / 100;
			const newValue = Math.round(result * 100) / 100;
			const spans = [...displaySpans];
			spans[current.id] = { ...current, value: `${newValue}` };
			setDisplaySapns(spans);
		}
	};
	const handleSign = () => {
		const current: Span = getLastSpan();
		if (current.type === "number") {
			const newValue = Number(current.value) * -1;
			const spans = [...displaySpans];
			spans[current.id] = { ...current, value: `${newValue}` };
			setDisplaySapns(spans);
		}
	};
	const showHistory = () => {
		const modal = historyModal.current;
		const textHistory = document.querySelector(".view-history");
		if (modal && textHistory) {
			if (modal.classList.contains("show")) {
				modal.classList.remove("show");
				textHistory.innerHTML = "View History";
			} else {
				modal.classList.add("show");
				textHistory.innerHTML = "Hide History";
			}
		}
	};
	const clearHistory = () => {
		setHistory([]);
	};
	useEffect(() => {
		setScrollToEnd();
	}, [displaySpans]);
	useEffect(() => {
		console.log(history);
	}, [history]);
	return (
		<div className="calculator">
			<header>
				<h1>Calculator</h1>
				<div className="history">
					<h2
						className="view-history"
						onClick={() => {
							showHistory();
						}}
					>
						View History
					</h2>
					<h2>Last Operation</h2>
				</div>
			</header>
			<main>
				<div className="information">
					<div className="last-history custom-scroll">
						{lastOperation.map((el) => (
							<span key={`last-operation-${el.id}`} className={el.type}>
								{el.value}
							</span>
						))}
					</div>
					<div className="result custom-scroll" ref={resultElement}>
						{displaySpans.map((el) => (
							<span key={el.id} className={el.type}>
								{el.value}
							</span>
						))}
					</div>
				</div>
				<div className="buttons">
					<button
						onClick={(event) => {
							handleClear();
						}}
					>
						C
					</button>
					<button
						onClick={(event) => {
							handlePercent();
						}}
					>
						%
					</button>
					<button
						onClick={(event) => {
							handleOperations(event.currentTarget.innerText);
						}}
					>
						÷
					</button>
					<button
						onClick={(event) => {
							handleClearLast();
						}}
					>
						⌫
					</button>
					<button
						onClick={(event) => {
							handleNumbers(event.currentTarget.innerText);
						}}
					>
						7
					</button>
					<button
						onClick={(event) => {
							handleNumbers(event.currentTarget.innerText);
						}}
					>
						8
					</button>
					<button
						onClick={(event) => {
							handleNumbers(event.currentTarget.innerText);
						}}
					>
						9
					</button>
					<button
						onClick={(event) => {
							handleOperations(event.currentTarget.innerText);
						}}
					>
						x
					</button>
					<button
						onClick={(event) => {
							handleNumbers(event.currentTarget.innerText);
						}}
					>
						4
					</button>
					<button
						onClick={(event) => {
							handleNumbers(event.currentTarget.innerText);
						}}
					>
						5
					</button>
					<button
						onClick={(event) => {
							handleNumbers(event.currentTarget.innerText);
						}}
					>
						6
					</button>
					<button
						onClick={(event) => {
							handleOperations(event.currentTarget.innerText);
						}}
					>
						+
					</button>
					<button
						onClick={(event) => {
							handleNumbers(event.currentTarget.innerText);
						}}
					>
						1
					</button>
					<button
						onClick={(event) => {
							handleNumbers(event.currentTarget.innerText);
						}}
					>
						2
					</button>
					<button
						onClick={(event) => {
							handleNumbers(event.currentTarget.innerText);
						}}
					>
						3
					</button>
					<button
						onClick={(event) => {
							handleOperations(event.currentTarget.innerText);
						}}
					>
						-
					</button>
					<button
						onClick={(event) => {
							handleSign();
						}}
					>
						±
					</button>
					<button
						onClick={(event) => {
							handleNumbers(event.currentTarget.innerText);
						}}
					>
						0
					</button>
					<button
						onClick={(event) => {
							handleDot();
						}}
					>
						.
					</button>
					<button
						onClick={() => {
							handleResult();
						}}
					>
						=
					</button>
				</div>
			</main>
			<div ref={historyModal} className="history-modal">
				<div className="history-content custom-scroll">
					{history.length > 0 &&
						history.map((item, index) => (
							<>
								<div key={`history-item-${index}`} className="history-item">
									{item.map((el) => (
										<span key={`history-${index}-span-${el.id}`} className={el.type}>
											{el.value}
										</span>
									))}
								</div>
							</>
						))}
				</div>
				<div className="history-footer">
					<button
						onClick={(event) => {
							clearHistory();
						}}
						className="delete"
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
}

export default App;
