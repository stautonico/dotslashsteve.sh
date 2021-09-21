import App from '../src/App.svelte'
import {fireEvent, render} from '@testing-library/svelte'
import "@testing-library/jest-dom";

describe("clicker", () => {
  it('it works', async () => {
    const {container} = render(App);

    expect(container.getElementsByTagName("body")[0]).not.toBeUndefined();

  });

  it('increment works', async () => {
    const {getByText, getByTestId} = render(App);

    const incrementButton = getByText("Increment");

    let counter = getByTestId("counter");

    await fireEvent.click(incrementButton);
    await fireEvent.click(incrementButton);
    await fireEvent.click(incrementButton);
    expect(counter).toHaveTextContent('3');
  })
});