import { Todo } from "./src/types/Todo";

export const todoData: Todo[] = [
    {
        "id": 4,
        "text": "Task 2",
        "datetime": new Date("2024-05-03"),
        "checked": false,
        "priority": "low"
    },
    {
        "id": 3,
        "text": "Task 1",
        "datetime": new Date("2024-05-04"),
        "checked": false,
        "priority": "low"
    },
    {
        "id": 2,
        "text": "Expired Todo 2",
        "datetime": new Date("2024-05-02"),
        "checked": false,
        "priority": "medium"
    },
    {
        "id": 1,
        "text": "Expired Todo",
        "datetime": new Date("2024-05-01"),
        "checked": true,
        "priority": "high"
    }
]