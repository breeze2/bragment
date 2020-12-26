const LANGUAGE = 'LANGUAGE';
const RECENT_BOARD_ID_LIST = 'RECENT_BOARD_ID_LIST';

export function getLocalLanguage() {
  const language = window.localStorage.getItem(LANGUAGE) || navigator.language;
  return language;
}

export function setLocalLanguage(language: string) {
  window.localStorage.setItem(LANGUAGE, language);
}

export function getLocalRecentlyBoardIds() {
  let recentBoardIds: string[] = [];
  try {
    const json = window.localStorage.getItem(RECENT_BOARD_ID_LIST);
    if (json) {
      const list = JSON.parse(json);
      recentBoardIds = list instanceof Array ? list : recentBoardIds;
    }
  } catch {
    // do nothing
  }
  return recentBoardIds;
}

export function setLocalRecentlyBoardIds(recentBoardIds: string[]) {
  window.localStorage.setItem(
    RECENT_BOARD_ID_LIST,
    JSON.stringify(recentBoardIds.slice(0, 30))
  );
}
