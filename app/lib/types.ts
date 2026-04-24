/**
 * Task type definition
 */
export interface Task {
  id: string;
  text: string;
  dueDate: Date | null;
  createdAt: Date;
}
