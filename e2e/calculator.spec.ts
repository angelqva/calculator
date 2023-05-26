import { test, expect, _electron as electron } from "@playwright/test";

test.describe.configure({ mode: "serial" });
let app: any;
let page: any;
test.beforeAll(async ({ browser }) => {
	app = await electron.launch({ args: [".", "--no-sandbox"] });
	page = await app.firstWindow();
});
test.afterAll(async () => {
	await app.close();
});

test("Check App Run", async () => {
	expect(await page.title()).toBe("Calculator");
	await page.screenshot({ path: "e2e/screenshots/calculator.png" });
});

test("Calculator Check Sum", async () => {
	await page.getByRole("button", { name: "C" }).click();
	await page.getByRole("button", { name: "9" }).click();
	await page.getByRole("button", { name: "+" }).click();
	await page.getByRole("button", { name: "9" }).click();
	await page.getByRole("button", { name: "=" }).click();
	expect(
		await page.evaluate(async () => {
			const lastSpan: HTMLSpanElement | null = document.querySelector(".result span:last-of-type");
			const result = lastSpan ? Number(lastSpan.innerText) : 0;
			return result;
		}),
	).toBe(18);
	await page.screenshot({ path: "e2e/screenshots/checkSum.png" });
});