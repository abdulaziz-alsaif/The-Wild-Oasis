import Modal from "../../ui/Modal";

import Button from "../../ui/Button";
import CreateEditCabinForm from "./CreateEditCabinForm";

function AddCabin() {
  // all state related to modal is managed inside Modal
  // it provides onCloseModal to all children components that are not of type Modal
  return (
    <div>
      <Modal>
        <Modal.Open opens="cabin-form">
          <Button>Add new cabins</Button>
        </Modal.Open>

        <Modal.Window name="cabin-form">
          <CreateEditCabinForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddCabin;
