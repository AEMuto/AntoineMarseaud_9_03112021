import { resolve, dirname, parse, join } from 'path'
import { defineConfig } from 'vite';
import { fileURLToPath } from 'url'

const _dirname = typeof __dirname !== 'undefined'
	? __dirname
	: dirname(fileURLToPath(import.meta.url))

export default defineConfig({
	build: {
		rollupOptions: {
			input: entryPoints(
				"index.html",
				"coverage/lcov-report/index.html",
				"coverage/lcov-report/constants/index.html",
				"coverage/lcov-report/constants/routes.js.html",
				"coverage/lcov-report/constants/usersTest.js.html",
				"coverage/lcov-report/containers/Bills.js.html",
				"coverage/lcov-report/containers/Dashboard.js.html",
				"coverage/lcov-report/containers/index.html",
				"coverage/lcov-report/containers/Login.js.html",
				"coverage/lcov-report/containers/Logout.js.html",
				"coverage/lcov-report/containers/NewBill.js.html",
				"coverage/lcov-report/views/Actions.js.html",
				"coverage/lcov-report/views/BillsUI.js.html",
				"coverage/lcov-report/views/DashboardFormUI.js.html",
				"coverage/lcov-report/views/DashboardUI.js.html",
				"coverage/lcov-report/views/ErrorPage.js.html",
				"coverage/lcov-report/views/index.html",
				"coverage/lcov-report/views/LoadingPage.js.html",
				"coverage/lcov-report/views/LoginUI.js.html",
				"coverage/lcov-report/views/NewBillUI.js.html",
				"coverage/lcov-report/views/VerticalLayout.js.html"
			),
		}
	}
});

function entryPoints(...paths) {
	const entries = paths.map(parse).map(entry => {
		const { dir, base, name, ext } = entry;
		const key = join(dir, name);
		const path = resolve(_dirname, dir, base);
		return [key, path];
	});

	const config = Object.fromEntries(entries);
	return config;
}