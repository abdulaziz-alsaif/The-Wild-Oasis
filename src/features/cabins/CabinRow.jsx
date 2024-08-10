/* eslint-disable react/prop-types */
import { useDeleteCabin } from "./useDeleteCabin";

import { formatCurrency } from "../../utils/helpers";

import styled from "styled-components";

import CreateEditCabinForm from "./CreateEditCabinForm";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import { useCreateEditCabin } from "./useCreateEditCabin";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
`;

function CabinRow({ cabin }) {
  const { isDeleting, deleteCabin } = useDeleteCabin();
  const { mutate: createCabin, isLoading: isCreating } = useCreateEditCabin();

  const { id, name, image, regularPrice, discount, maxCapacity, description } =
    cabin;

  function handleDuplicate() {
    createCabin({
      newCabin: {
        name: `A copy of ${name}`,
        maxCapacity,
        regularPrice,
        discount,
        description,
        image,
      },
    });
  }

  return (
    <Table.Row>
      <Img src={image} />

      <Cabin>{name}</Cabin>

      <div>Fits up to {maxCapacity} guests</div>

      <Price>{formatCurrency(regularPrice)}</Price>

      {discount ? (
        <Discount>{formatCurrency(discount)}</Discount>
      ) : (
        <span>&mdash;</span>
      )}

      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={id} />

            <Menus.List id={id}>
              <Menus.Button
                icon={<HiSquare2Stack />}
                onClick={handleDuplicate}
                disabled={isCreating}
              >
                Duplicate
              </Menus.Button>
              <Modal.Open opens="cabin-edit">
                <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
              </Modal.Open>

              <Modal.Open opens="cabin-delete">
                <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
              </Modal.Open>
            </Menus.List>
          </Menus.Menu>

          <Modal.Window name="cabin-edit">
            <CreateEditCabinForm cabinToEdit={cabin} />
          </Modal.Window>

          <Modal.Window name="cabin-delete">
            <ConfirmDelete
              resourceName={cabin.name}
              onConfirm={() => deleteCabin(cabin.id)}
              disabled={isDeleting}
            />
          </Modal.Window>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default CabinRow;
