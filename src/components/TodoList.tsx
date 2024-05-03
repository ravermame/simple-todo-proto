"use client";
import { Todo } from "@/types/Todo";
import React, { useEffect, useState } from "react";
import delete_icon from "../assets/delete.svg";
import edit_icon from "../assets/edit.svg";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import dayjs from "dayjs";
import { priorityOptions } from "@/enums";
import Image from "next/image";
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'

const selectOptions: { [key: string]: string } = priorityOptions;
interface TodoListProps {
  todos: Todo[];
  onDelete: (id: number) => void;
  onEdit: (todo: Todo) => void;
  setTodos: Function;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  onDelete,
  onEdit,
  setTodos,
}) => {
  // handle delete event
  const handleDelete = (id: number) => {
    onDelete(id);
  };

  // handle edit event
  const handleEdit = (todo: Todo) => {
    onEdit(todo);
  };

  // handle drag and sort event
  const handleDragEnd = (result: any) => {
    if (!result.destination) return; // dropped outside the list
    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTodos(items);
  };

  // handle completed change
  const handleCheckedChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, checked: e.target.checked };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  // Function to format dates
  const formatDate = (date: Date | null) => {
    const today = dayjs().startOf("day");
    const tomorrow = dayjs().add(1, "day").startOf("day");

    const todoDate = dayjs(date);
    if (todoDate.isSame(today, "day")) {
      return "Today";
    } else if (todoDate.isSame(tomorrow, "day")) {
      return "Tomorrow";
    } else {
      return todoDate.format("DD MMM YYYY");
    }
  };

  // Function to determine if todo is expired
  const isExpired = (date: Date | null) => {
    if (!date) return false; // Handle null case
    const todoDate = dayjs(date);
    return todoDate.isBefore(dayjs(), "day");
  };

  return (
    /* Draggable cards */
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="todos">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {todos.map((todo, index) => (
              <Draggable
                key={index}
                draggableId={`todo-${index}`}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`flex justify-between w-full px-3 py-4 border-2 mb-4 rounded-md shadow-sm items-center bg-white ${isExpired(todo.datetime) ? "text-gray-400" : ""
                      }`}

                  >
                    <div className="flex align-center justify-start">
                      {/* checkbox to mark the todo as don */}
                      <label
                        className="relative flex items-center p-3 rounded-full cursor-pointer"
                        htmlFor="check"
                      >
                        <input
                          type="checkbox"
                          checked={todo?.checked}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleCheckedChange(e, todo?.id)
                          }
                          className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
                          id={`check-${todo.id}`}
                        />
                        <span className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="1"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </span>
                      </label>

                      <div className="flex ml-2">
                        <div className="flex flex-col">
                          <div>
                            <span
                              className={`font-medium text-lg ${todo?.checked && "line-through"
                                }`}
                            >
                              {todo.text}
                            </span>
                            <span
                              /* conditions base tailwind bg color classes for priority */
                              className={` ms-2 ${todo.priority && (selectOptions[todo.priority] == priorityOptions.high
                                ? "bg-red-100 text-red-800"
                                : selectOptions[todo.priority] == priorityOptions.medium
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100  text-blue-800")
                                } text-sm font-medium me-2 px-1 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300`}
                            >
                              {selectOptions[todo.priority]}
                            </span>
                          </div>

                          <span className="font-medium text-sm ">
                            {formatDate(todo?.datetime)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 items-center">
                      {/* Edit todo */}
                      <button
                        onClick={() => handleEdit(todo)}
                        className="bg-transparent px-2 py-1 rounded-md text-whit"
                        data-tooltip-id={`edit-tooltip-${todo.id}`} data-tooltip-content="Edit"
                      >
                        <Image src={edit_icon} alt="edit" />
                        <Tooltip id={`edit-tooltip-${todo.id}`} />
                      </button>
                      {/* Delete todo */}
                      <button
                        onClick={() => handleDelete(todo.id)}
                        className="bg-transparent px-2 py-1 rounded-md text-white"
                        data-tooltip-id={`delete-tooltip-${todo.id}`} data-tooltip-content="Delete"
                      >
                        <Image src={delete_icon} alt="delete" />
                        <Tooltip id={`delete-tooltip-${todo.id}`} />
                      </button>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TodoList;
