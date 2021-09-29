import App from '../src/App.svelte'
import {render} from '@testing-library/svelte'
import "@testing-library/jest-dom";

describe("app", () => {
    it('it works', async () => {
        let {container} = render(App);
        container = container.parentElement;

        expect(container.getElementsByTagName("body")[0]).not.toBeUndefined();

    });
});