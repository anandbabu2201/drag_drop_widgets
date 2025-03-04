import { Project, ProjectStatus } from "../models/project";
/**
 * Type alias for a listener function that takes an array of items of type T.
 */
type Listener<T> = (items: T[]) => void;

/**
 * Base State class to manage listeners.
 * @template T - The type of items managed by the state.
 */
class State<T> {
  protected listeners: Listener<T>[] = [];

  /**
   * Adds a listener function to the state.
   * @param listenerFn - The listener function to be added.
   */
  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

/**
 * Singleton class to manage the state of projects.
 * Extends the base State class.
 */
export class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  /**
   * Private constructor to enforce singleton pattern.
   */
  private constructor() {
    super();
  }

  /**
   * Returns the single instance of ProjectState.
   * @returns The instance of ProjectState.
   */
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  /**
   * Adds a new project to the state.
   * @param title - The title of the project.
   * @param description - The description of the project.
   * @param numOfPeople - The number of people involved in the project.
   */
  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }

  /**
   * Moves a project to a new status.
   * @param projectId - The ID of the project to be moved.
   * @param newStatus - The new status of the project.
   */
  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((prj) => prj.id === projectId);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  /**
   * Updates all listeners with the current state of projects.
   */
  private updateListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

/**
 * The single instance of ProjectState.
 */
export const projectState = ProjectState.getInstance();
