import { useEffect, useRef, useState } from "react";
import "./App.scss";
import { useCalculator } from "./hooks/calculator";
function App() {
	const resultElement = useRef<HTMLDivElement | null>(null);
	const {
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
	} = useCalculator();
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
	useEffect(() => {
		setScrollToEnd();
	}, [displaySpans]);
	return (
		<div className="calculator">
			<header>
				<h1>Calculator</h1>
				<div className="history">
					<h2
						className="view-history"
						onClick={() => {
							setShowHistory(!showHistory);
						}}
					>
						{showHistory ? "Hide History" : "View History"}
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
							clickClear();
						}}
					>
						C
					</button>
					<button
						onClick={(event) => {
							clickPercent();
						}}
					>
						%
					</button>
					<button
						onClick={(event) => {
							clickOperations(event.currentTarget.innerText);
						}}
					>
						÷
					</button>
					<button
						onClick={(event) => {
							clickClearLast();
						}}
					>
						⌫
					</button>
					<button
						onClick={(event) => {
							clickNumbers(event.currentTarget.innerText);
						}}
					>
						7
					</button>
					<button
						onClick={(event) => {
							clickNumbers(event.currentTarget.innerText);
						}}
					>
						8
					</button>
					<button
						onClick={(event) => {
							clickNumbers(event.currentTarget.innerText);
						}}
					>
						9
					</button>
					<button
						onClick={(event) => {
							clickOperations(event.currentTarget.innerText);
						}}
					>
						x
					</button>
					<button
						onClick={(event) => {
							clickNumbers(event.currentTarget.innerText);
						}}
					>
						4
					</button>
					<button
						onClick={(event) => {
							clickNumbers(event.currentTarget.innerText);
						}}
					>
						5
					</button>
					<button
						onClick={(event) => {
							clickNumbers(event.currentTarget.innerText);
						}}
					>
						6
					</button>
					<button
						onClick={(event) => {
							clickOperations(event.currentTarget.innerText);
						}}
					>
						+
					</button>
					<button
						onClick={(event) => {
							clickNumbers(event.currentTarget.innerText);
						}}
					>
						1
					</button>
					<button
						onClick={(event) => {
							clickNumbers(event.currentTarget.innerText);
						}}
					>
						2
					</button>
					<button
						onClick={(event) => {
							clickNumbers(event.currentTarget.innerText);
						}}
					>
						3
					</button>
					<button
						onClick={(event) => {
							clickOperations(event.currentTarget.innerText);
						}}
					>
						-
					</button>
					<button
						onClick={(event) => {
							clickSign();
						}}
					>
						±
					</button>
					<button
						onClick={(event) => {
							clickNumbers(event.currentTarget.innerText);
						}}
					>
						0
					</button>
					<button
						onClick={(event) => {
							clickDot();
						}}
					>
						.
					</button>
					<button
						onClick={() => {
							calcResult();
						}}
					>
						=
					</button>
				</div>
			</main>
			<div className={`history-modal ${showHistory && "show"}`}>
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
