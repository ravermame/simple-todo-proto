"use client";
import { priorityOptions } from "@/enums";
// import types
import { TodoFormProps } from "@/types/Todo";
import React, { useState, FormEvent, useEffect } from "react";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";

const TodoForm: React.FC<TodoFormProps> = ({
  handleAddTodo,
  handleUpdateTodo,
  editTodo = { id: 0, text: "", datetime: null, priority: "", checked: false },
  openForm,
  setOpenForm,
}) => {
  const [todo, setTodo] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // New state for selected date
  const [priority, setPriority] = useState<string>("");
  const [checked, setChecked] = useState<boolean>(false);
  // handle the event on submit form
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // check validation if input field is empty
    if (todo.trim() === "") {
      toast.error("Field cannot be empty!!");
      return;
    }
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }
    setLoader(true);
    setTimeout(() => {
      // check if it is edit mode
      if (editTodo?.id)
        handleUpdateTodo({
          id: editTodo?.id,
          text: todo,
          datetime: selectedDate,
          priority,
          checked,
        }); // call update method in edit mode
      else handleAddTodo(todo, selectedDate, priority); // call create method

      setLoader(false);
      setTodo(""); // set the input field back to empty
      setSelectedDate(new Date());
      setPriority("");
      setChecked(false);
    }, 1000);
  };

  // handle the change event of input field
  const handleChangeTodo = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTodo(e.target.value);
  };

  // handle date change
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  // handle priority change
  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriority(e.target.value);
  };

  // handle completed change
  const handleCheckedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  };

  const handleCancelForm = () => {
    setOpenForm(false);
    setTodo(""); // set the input field back to empty
    setSelectedDate(new Date());
    setPriority("");
    setChecked(false);
  };

  // being called on editTodo state change
  useEffect(() => {
    setTodo(editTodo?.text || "");
    setSelectedDate(editTodo?.datetime || new Date());
    setPriority(editTodo?.priority || "");
    setChecked(editTodo?.checked || false);
  }, [editTodo]);

  return (
    <div
      className={`fixed z-10 inset-0 overflow-y-auto bg-stone-600 backdrop-blur-sm bg-opacity-50 ${
        openForm ? "" : "hidden"
        }`}
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="modal-container bg-white w-full max-w-lg mx-auto rounded shadow-lg">
          <div className="modal-content py-4 px-6">
            <div className="flex justify-between items-center pb-3">
              {/* update message on base of edit mode */}
              <h3 className="text-lg font-semibold">
                {editTodo?.id ? "Edit" : "Create"} Todo
              </h3>
              <button
                onClick={handleCancelForm} // handle close button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {/* close icon */}
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} className="mt-4">
                {/* input field for todo text */}
                <textarea
                  value={todo}
                  onChange={handleChangeTodo}
                  placeholder="Enter your todo..."
                  className="w-full border-2 mb-2 rounded-md p-2 focus:outline-none focus:border-blue-500"
                />
                <div className="grid grid-cols-2 gap-x-4 items-center mb-4">
                  <div>
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateChange}
                      placeholderText="Select date and time"
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      minDate={new Date()}
                      dateFormat="MMMM d, yyyy"
                      className="w-full border-2 mb-2 rounded-md p-2 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <select
                    value={priority}
                    onChange={handlePriorityChange}
                    className="w-full border-2 mb-2 rounded-md p-2 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select Priority</option>
                    {Object.entries(priorityOptions).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                {editTodo?.id && (
                  <>
                    {" "}
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={handleCheckedChange}
                      className="mr-1"
                    />
                    <label htmlFor="completed">Completed</label>
                  </>
                )}
                <div className="w-full flex justify-end">
                  <button
                    onClick={handleCancelForm}
                    type="button"
                    className="mt-2 bg-yellow-400 text-white rounded-md px-4 py-2 hover:bg-yellow-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="mt-2 bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 ml-3"
                  >
                    {/* handle loader conditons */}
                    {/* show loader when saving todo form */}
                    {loader ? (
                      <svg
                        aria-hidden="true"
                        className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoForm;
