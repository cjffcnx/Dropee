import generateUserId from './generateUserId';

const STORAGE_KEY = 'dropeeUserId';

const storeUser = () => {
  let userId = localStorage.getItem(STORAGE_KEY);
  if (!userId) {
    userId = generateUserId();
    localStorage.setItem(STORAGE_KEY, userId);
  }
  return userId;
};

export default storeUser;
