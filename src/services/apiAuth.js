import supabase, { supabaseUrl } from "./supabase";

export async function signup({ fullName, email, password }) {
  // Save the current user session before signing up a new user
  // supabase.auth.signUp function will remove the current user session
  const {
    data: { session: currentUserSession },
    errorSession,
  } = await supabase.auth.getSession();

  // Don't continue if we can't get current user session
  if (errorSession) {
    throw new Error("Something went wrong, Please try again later.");
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
        avatar: "",
      },
    },
  });

  console.log("Sign-up response:", { user, error });

  // restore previously authenticated user session
  if (currentUserSession) {
    await supabase.auth.setSession(currentUserSession);
  }

  // Handle errors
  let authError = null;

  // authError.name is only used for debugging
  if (user && !user.identities.length) {
    authError = {
      name: "AuthApiError",
      message: "This email has already been registered",
    };
  } else if (error) {
    authError = {
      name: error.name,
      message: error.message,
    };
  }

  if (authError) {
    throw new Error(authError.message);
  }

  return user;
}

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { data, error };
}

// The reason why we get user data from api in authentication to protect routes instead of using the one the come with current session is because session could be tampered with by the sender and ensure user data is validated and up-to-date.
export async function getUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  return { user, error };
}

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateUser({ fullName, password, avatar }) {
  // 1. update password or fullName
  // NOTE: we are using two different forms, one for updating password and other for fullname and avatar. In this case password and fullname won't be needed to be updated at the same time
  let updatedData = null;
  if (password) updatedData = { password };
  if (fullName) updatedData = { data: { fullName } };

  const { data: updatedUser, error: updateError } = await supabase.auth.updateUser(updatedData);

  if (updateError) {
    throw new Error(updateError.message);
  }

  if(!avatar) return updatedUser

  // 2. upload and delete (if exist) the avatar to/from bucket
  const imagePath = `avatar-${updatedUser.user.id}-${Math.random()}`

  const hasAvatarImage = updatedUser.user.user_metadata.avatar;

  // delete avatar image
  if(hasAvatarImage) {
    const existingImagePath = updatedUser.user.user_metadata.avatar.split("/")?.at(-1);

    const { error: imageDeleteError } = await supabase.storage.from("avatars").remove([existingImagePath]);

    if (imageDeleteError) throw new Error(imageDeleteError.message);
  }

  // upload new avatar image
  const { error: imageUploadError } = await supabase.storage.from("avatars").upload(imagePath, avatar);

  if (imageUploadError) throw new Error(imageUploadError.message);

  // 3.update avatar field in user
  const { data: avatarUpdatedUser, error: avatarUpdateError } =
    await supabase.auth.updateUser({
      data: {
        avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${imagePath}`,
      },
    });
 
  if (avatarUpdateError) throw new Error(avatarUpdateError.message);

  return avatarUpdatedUser
}
