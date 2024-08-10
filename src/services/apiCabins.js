import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("cabins could not be loaded");
  }

  return data;
}

export async function createEditCabin(newCabin, id) {
  console.log(newCabin, id);
  // in case of image edit without editing image, we will have image path
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  // Remove All / because / will create a new Folder in Bucket if it was in imageName
  // Which we don't want that
  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    ""
  );
  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // New cabin obj need to be { some_column: 'someValue', other_column: 'otherValue' }
  // 1- Craete/edit a cabin
  let query = supabase.from("cabins");

  // A) In case of create
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  // B) In case of update
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id);

  const { data, error } = await query.select();

  console.log(data);

  if (error) {
    console.error(error);
    throw new Error("cabin could not be created");
  }

  if (hasImagePath) return data;

  // 2- Upload cabin image to bucket
  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  // 3- if error happens when uploading image delete new cabin from supabase
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data[0].id);
    console.error(storageError);
    throw new Error(
      "Cabin image could not be uploaded and cabin was not be created"
    );
  }

  return data;
}

export async function deleteCabin(cabinId) {
  const { data, error } = await supabase
    .from("cabins")
    .delete()
    .eq("id", cabinId)
    .select();

  if (error) {
    console.error(error);
    throw new Error("cabin could not be deleted");
  }

  return data;
}
