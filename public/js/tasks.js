/**
 * tasks.js
 * Módulo para gerenciar a lógica das tarefas (reordenação, conclusão e interrupções).
 */

import { state } from './state.js';

export function addTask(name, estimate) {
    const cleanName = typeof name === 'string' ? name.trim() : '';
    if (!cleanName) return null;

    const newTask = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        name: cleanName,
        pomodoroEstimate: Math.max(1, parseInt(estimate, 10) || 1),
        pomodorosCompleted: 0,
        internalInterruptions: 0,
        externalInterruptions: 0,
        focusTime: 0,
        completed: false,
        isEditing: false,
    };
    state.tasks.push(newTask);
    return newTask;
}

export function deleteTask(id) {
    state.tasks = state.tasks.filter((task) => task.id !== id);
    if (state.selectedTaskId === id) {
        selectTask(state.tasks.find((t) => !t.completed)?.id || null);
    }
}

export function moveTask(id, direction) {
    const index = state.tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= state.tasks.length) return false;

    const [moved] = state.tasks.splice(index, 1);
    state.tasks.splice(targetIndex, 0, moved);
    return true;
}

export function toggleTaskCompleted(id) {
    const task = state.tasks.find((t) => t.id === id);
    if (!task) return false;

    task.completed = !task.completed;
    if (task.completed && state.selectedTaskId === id) {
        selectTask(state.tasks.find((t) => !t.completed)?.id || null);
    }
    return task.completed;
}

export function toggleShowCompleted() {
    state.showCompletedTasks = !state.showCompletedTasks;
}

export function toggleEditState(id) {
    let inputToFocus = null;
    state.tasks.forEach((task) => {
        if (task.id === id) {
            task.isEditing = !task.isEditing;
            if (task.isEditing) {
                inputToFocus = `[data-edit-input-id="${id}"]`;
            }
        } else {
            task.isEditing = false;
        }
    });
    return inputToFocus;
}

export function updateTask(id, newName, newEstimate) {
    const task = state.tasks.find((t) => t.id === id);
    if (!task) return false;

    const clean = typeof newName === 'string' ? newName.trim() : '';
    if (clean) task.name = clean;

    if (newEstimate !== undefined && newEstimate !== null && newEstimate !== '') {
        const parsed = parseInt(newEstimate, 10);
        if (!Number.isNaN(parsed) && parsed >= 1) {
            task.pomodoroEstimate = parsed;
        }
    }

    task.isEditing = false;
    return true;
}

export function updateTaskName(id, newName) {
    return updateTask(id, newName);
}

export function selectTask(id) {
    const task = state.tasks.find((t) => t.id === id);
    if ((task || id === null) && !state.tasks.some((t) => t.isEditing)) {
        state.selectedTaskId = id;
        return true;
    }
    return false;
}

export function logInterruption(type) {
    if (state.isRunning && state.mode === 'focus' && state.selectedTaskId) {
        const task = state.tasks.find((t) => t.id === state.selectedTaskId);
        if (task) {
            if (type === 'internal') task.internalInterruptions++;
            else if (type === 'external') task.externalInterruptions++;
            state.uninterruptedSessionsToday = 0;
            return true;
        }
    }
    return false;
}
