import { Component } from "./base-component";
import { Validatable, validateForm } from "../utils/validation";
import { autobinding } from "../decorators/autobind";
import { projectState } from "../state/project-state";

//projectInput class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");
    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.configure();
    // this.attach(); // removed as it is private and already called in the Component constructor
  }

  configure() {
    this.element.addEventListener("click", this.submitHandler);
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    // if (
    //   enteredDescription.trim().length === 0 ||
    //   enteredTitle.trim().length === 0 ||
    //   enteredPeople.trim().length === 0
    // ) {
    //   alert("Invalid input, please try again");
    //   return;
    // } else {
    //   return [enteredTitle, enteredDescription, +enteredPeople];
    // }

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };

    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };

    const peopleValidatable: Validatable = {
      value: +enteredPeople, // + is used to convert string to number
      required: true, // required is not necessary here
      min: 1,
      max: 5,
    };

    if (
      !validateForm(titleValidatable) &&
      !validateForm(descriptionValidatable) &&
      !validateForm(peopleValidatable)
    ) {
      alert("Invalid input, please try again");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  @autobinding
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      projectState.addProject(title, desc, people);
      this.clearInputs();
    }
  }

  renderContent() {}
}
