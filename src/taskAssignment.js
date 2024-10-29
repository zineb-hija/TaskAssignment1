function assignTasksWithPriorityAndDependencies(developers, tasks) {
    // Étape 1 : Trier les tâches par priorité et dépendances
    tasks.sort((a, b) => b.priority - a.priority);

    const unassignedTasks = [];
    const devAssignments = developers.map(dev => ({ 
        ...dev, 
        assignedTasks: [], 
        totalHours: 0 
    }));
    
    const completedTasks = new Set();

    // Étape 2 : Assigner chaque tâche en respectant les dépendances et la priorité
    for (let task of tasks) {
        const dependenciesMet = task.dependencies.every(dep => completedTasks.has(dep));
        
        if (!dependenciesMet) {
            unassignedTasks.push(task);
            continue;
        }

        let eligibleDevs = devAssignments.filter(dev => 
            dev.skillLevel >= task.difficulty &&
            dev.totalHours + task.hoursRequired <= dev.maxHours &&
            (dev.preferredTaskType === task.taskType || dev.preferredTaskType === null)
        );

        if (eligibleDevs.length > 0) {
            const selectedDev = eligibleDevs.reduce((leastLoadedDev, dev) => 
                dev.totalHours < leastLoadedDev.totalHours ? dev : leastLoadedDev
            );

            selectedDev.assignedTasks.push(task.taskName);
            selectedDev.totalHours += task.hoursRequired;
            completedTasks.add(task.taskName);
        } else {
            unassignedTasks.push(task);
        }
    }

    return {
        developers: devAssignments,
        unassignedTasks: unassignedTasks
    };
}

// Exemple d’utilisation
const developers = [
    { name: 'Alice', skillLevel: 7, maxHours: 40, preferredTaskType: 'feature' },
    { name: 'Bob', skillLevel: 9, maxHours: 30, preferredTaskType: 'bug' },
    { name: 'Charlie', skillLevel: 5, maxHours: 35, preferredTaskType: 'refactor' },
];

const tasks = [
    { taskName: 'Feature A', difficulty: 7, hoursRequired: 15, taskType: 'feature', priority: 4, dependencies: [] },
    { taskName: 'Bug Fix B', difficulty: 5, hoursRequired: 10, taskType: 'bug', priority: 5, dependencies: [] },
    { taskName: 'Refactor C', difficulty: 9, hoursRequired: 25, taskType: 'refactor', priority: 3, dependencies: ['Bug Fix B'] },
    { taskName: 'Optimization D', difficulty: 6, hoursRequired: 20, taskType: 'feature', priority: 2, dependencies: [] },
    { taskName: 'Upgrade E', difficulty: 8, hoursRequired: 15, taskType: 'feature', priority: 5, dependencies: ['Feature A'] },
];

console.log(assignTasksWithPriorityAndDependencies(developers, tasks));
