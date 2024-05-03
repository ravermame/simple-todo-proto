export interface Todo {
    id: number;
    text: string;
    datetime: Date | null;
    checked: boolean;
    priority: string;
}

export interface TodoFormProps {
    handleAddTodo: (newText: string, selectedDate: Date, priority: string) => void;
    handleUpdateTodo: (todo: Todo) => void;
    editTodo: Todo | null;
    openForm: boolean;
    setOpenForm: Function;
}