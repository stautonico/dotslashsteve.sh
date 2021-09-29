import App from '../src/pages/login/index.svelte'
import {render} from '@testing-library/svelte'
import "@testing-library/jest-dom";

describe("login", () => {
    it('it works', async () => {
        let {container} = render(App);
        container = container.parentElement;

        // There should be 3 inputs (username + password field and remember me checkbox)
        expect(container.getElementsByTagName("input").length).toBe(3);

        // Make sure the login button renders
        expect(container.getElementsByTagName("button").length).toBe(1);

    });
});