export const MAX_TASK_TIME_IN_MIN = 5;

function initiateTaskTime() {
  const date = new Date();
  const initialTimeInMs = date.getTime();
  const initialHour = date.toLocaleTimeString('es-AR');
  Logger.log(`Task initiated: ${initialHour}`);
  return initialTimeInMs;
}

const INITIAL_TASK_TIME = initiateTaskTime();

export function checkExecutionTime() {
  return new Date().getTime() - INITIAL_TASK_TIME > MAX_TASK_TIME_IN_MIN * 60 * 1000;
}
