import { Link } from "react-router-dom";
import styled from "styled-components";
import { EditButton } from "../styled_components/buttons/buttons";
import { DeleteButton } from "../styled_components/buttons/buttons";
import { StatusButton } from "../styled_components/buttons/buttons";
import React, { useState } from "react";
import dots from "../assets/dots_button.svg"
import trash from "../assets/trash.svg"
import phone from "../assets/phone.svg"
import { discount } from "../aux_functions/auxFunctions";
import { useDispatch } from "react-redux";
import { useAppDispatch } from "../app/store";
import { deleteBooking } from "../features/bookings/bookingsThunks";
import { StatusText } from "./UserForm";
import { deleteUser } from "../features/users/usersThunks";
import { deleteRoom } from "../features/rooms/roomsThunks";
import { Booking, Room, User, Contact } from "../interfaces/interfaces";
import { amenitiesToString } from "./RoomForm";
import { archiveContacts } from "../features/contacts/contactsThunks";

interface RoomStatusProps {
    roomStatus?: boolean
}

const RoomStatusButton = styled(EditButton)<RoomStatusProps>`
    background-color: ${props => props.roomStatus ? "#5AD07A" : "#E23428"};
    color: #FFFFFF;
`;

const RequestModal = styled.div`
    position: absolute;
    background-color:#135846;
    color: #FFFFFF;
    top: 20%;
    right: 25%;
    width: 400px;
    min-height: 80px;
    border-radius: 12px;
    padding: 15px;
    z-index: 100;
    p {
        padding: 15px 0;
    }
`;

const TableContainer = styled.table`
    background-color: #FFFFFF;
    box-shadow: 0px 20px 30px #00000014;
    border-radius: 20px;
    text-align: left;
    width: 100%;
    border-collapse: collapse;
    padding: 10px 25px;
    h4, p {
        margin: 5px 0;
    }
`;


const TableRow = styled.tr`
    position: relative;
    height: 90px;
    &:hover {
        scale: 1.015;
        z-index: 50;
    }
`;

const TableHeaderRow = styled.tr`
    height: 90px;
    border-bottom: 1px solid #b2b2b233;
`;

const TableColumnHeader = styled.th`
    padding: 20px;
`;
const TableDataElement = styled.td`
    max-width: 370px;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: 500;
    &.delete {
        max-width: 50px;
    }
    &.status {
        max-width: 100px;
    }
    .user__photo, .room__photo {
        box-shadow: 0px 20px 30px #00000014;
        border: 1px solid #b2b2b233;
        width: 130px;
        height: 130px;
        width: 90%;
        border-radius: 50%;
        object-fit: cover;
    }
    .room__photo {
        height: 100px;
        width: 150px;
        border-radius: 8px;
        margin-right: 20px;
    }
    .phone__icon {
        width: 15%;
        margin-right: 5px;
    }
`;

const TableLink = styled(Link)`
    text-decoration: none;
    color:#212121
`;

const DeleteDots = styled.button`
    position: relative;
    border: none;
    background: none;
    &:hover {
        cursor: pointer;
    }
`;

export const GreyText = styled.p`
    font-size: 14px;
    font-weight: 400;
    color: #6E6E6E;
`;

export const ArchiveButton = styled.button`
    background: none;
    border: none;
    color: #E23428;
    border-bottom: 1px solid #E23428;
    font-family: 'Poppins';
    font-weight: 600;
    font-size: 18px;
    &.archive-slider-btn {
        margin-right: 30px;
        font-size: 16px;
    }
    :hover {
        cursor: pointer;
        transform: scale(1.1);
        transition: all 0.5s;
    }
`;

const ArchivedButton = styled(ArchiveButton)`
    color: #135846;
    border-bottom: 1px solid #135846;
`;

const StrongText = styled.h4`
    font-weight: 600;
    font-size: 20px;
    &.lined {
        text-decoration: line-through;
        color:#e23428;
        
    }
    &.offer {
        color:#5AD07A;
        
    }
`;

const ElementTableInfoContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 2fr;
`;

const ElementTableTextContainer =  styled.div`
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const ElementTableDateTextContainer =  styled(ElementTableTextContainer)`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0
`;

const CloseModalButton = styled.button`
    position: absolute;
    color: #FFFFFF;
    border: none;
    background: none;
    right: 10px;
    :hover {
        cursor: pointer;
    }
`;

interface ITableProps {
    section: string,
    cols: string[],
    data: Booking[] | Room[] | Contact[] | User[]
}

const tableDateFormat = (date: string) => {
    const auxDate = date.substring(0, 10);
    return auxDate;
}

export const Table = (props: ITableProps) => {

    const dispatch = useAppDispatch();

    const [modal, setModal] = useState(false);
    const [request, setRequest] = useState("");

    const [showRequest, setShowRequest] = useState<null | string>(null);
    const [showDelete, setShowDelete] = useState<null | string>(null);

    const deleteBookingClickHandler = (id: string) => {
        setShowDelete(null);
        dispatch(deleteBooking(id));
    }
    const deleteUserClickHandler = (id: string) => {
        setShowDelete(null);
        dispatch(deleteUser(id));
    }

    const deleteRoomClickHandler = (id: string) => {
        setShowDelete(null);
        dispatch(deleteRoom(id));
    }

    const createBookingTableRows = (booking: Booking) => {
        if (booking) {
            return (
                
                <TableRow key={booking.id}>
                
                    <TableDataElement>
                        <TableLink to={`/bookings/${booking.id}`}>
                            <ElementTableTextContainer>
                                <StrongText>{booking.guest_name}</StrongText>
                                <GreyText>ID {booking.id}</GreyText>
                            </ElementTableTextContainer>
                        </TableLink>
                    </TableDataElement>
                    <TableDataElement><GreyText>{booking.order_date && tableDateFormat(booking.order_date)}</GreyText></TableDataElement>
                    <TableDataElement><GreyText>{booking.order_date && tableDateFormat(booking.check_in)}</GreyText></TableDataElement>
                    <TableDataElement><GreyText>{booking.order_date && tableDateFormat(booking.check_out)}</GreyText></TableDataElement>
                    <TableDataElement>{booking.special_request && <EditButton onClick={() => setShowRequest(prev => prev === booking.special_request ? null : booking.special_request)}>View Notes{showRequest === booking.special_request && <RequestModal><CloseModalButton onClick={() => setModal(false)}>X</CloseModalButton><p>{booking.special_request}</p></RequestModal>}</EditButton>}</TableDataElement>
                    <TableDataElement>{booking.room && booking.room.type} {booking.room && booking.room.number}</TableDataElement>
                    {/* <TableDataElement>{booking.room?.id}</TableDataElement>*/} 
                    <TableDataElement><StatusButton status={booking.status}>{booking.status}</StatusButton></TableDataElement>
                    <TableDataElement><DeleteDots onClick={() => setShowDelete(prev => prev === booking.id! ? null : booking.id!)}><img src={dots} alt="" />{showDelete === booking.id! && <DeleteButton onClick={() => deleteBookingClickHandler(booking.id!)}><img src={trash}/> Delete</DeleteButton>}</DeleteDots></TableDataElement>
                </TableRow>
                
            );
        }
        
    };

    const createDashboardBookingTableRows = (booking: Booking) => {
        if (booking) {
            return (
                <>
                <TableRow key={booking.id}>

                    <TableDataElement>
                        <img className="room__photo" src={booking.room && booking.room.photos[0]} alt="" />
                    </TableDataElement>
                
                    <TableDataElement>
                        
                        <ElementTableTextContainer>
                            <StrongText>{booking.room && booking.room.type} {booking.room && booking.room.number}</StrongText>
                            <GreyText>{booking.guest_name}</GreyText>
                        </ElementTableTextContainer>
                    </TableDataElement>
                    
                    <TableDataElement>
                        <ElementTableDateTextContainer>
                            <StrongText>From: </StrongText> <GreyText>{booking.check_in}</GreyText> <StrongText> To: </StrongText><GreyText>{booking.check_out}</GreyText>
                        </ElementTableDateTextContainer>
                    </TableDataElement>

                </TableRow>
                </>
            );
        }
        
    };

    const createRoomsTableRows = (room: Room) => {
        if (room) {
            return (
            <>
            <TableRow key={room.id}>
                <TableDataElement>
                    <TableLink to={`/rooms/${room.id}`}>
                        <ElementTableInfoContainer>
                            <img className="room__photo" src={room.photos && room.photos[0]} alt="" />
                            <ElementTableTextContainer>
                                <StrongText>{room.number}</StrongText>
                                <GreyText>ID {room.id}</GreyText>
                            </ElementTableTextContainer>
                        </ElementTableInfoContainer>
                    </TableLink>
                </TableDataElement>
                <TableDataElement>{room.type}</TableDataElement>
                <TableDataElement><GreyText>{room.amenities && amenitiesToString(room.amenities)}</GreyText></TableDataElement>
                <TableDataElement><StrongText className={room.discount !== 0 ? "lined" : ""}>$ {room.price}</StrongText><GreyText>/night</GreyText></TableDataElement>
                <TableDataElement><StrongText className={room.discount !== 0 ? "offer" : ""}>{room.discount !== 0 ? `$ ${discount(room.price, room.discount)}` : "-"} </StrongText><GreyText>/night</GreyText></TableDataElement>
                <TableDataElement><RoomStatusButton roomStatus={room.is_available}>{room.is_available ? "Available" : "Booked"}</RoomStatusButton></TableDataElement>
                <TableDataElement><DeleteDots onClick={() => setShowDelete(prev => prev === room.id! ? null : room.id!)}><img src={dots} alt="" />{showDelete === room.id! && <DeleteButton onClick={() => deleteRoomClickHandler(room.id!)}><img src={trash}/> Delete</DeleteButton>}</DeleteDots></TableDataElement>
            </TableRow>
            </>
        );
        }
        
    };

    const createContactsTableRows = (contact: Contact) => {
        if (contact) {
            return (
            <>
            <TableRow key={contact.id}>
                <TableDataElement>
                    <ElementTableTextContainer>
                        <StrongText>{contact.id}</StrongText>
                        <GreyText>{contact.contact_date}</GreyText>
                    </ElementTableTextContainer>
                </TableDataElement>
                <TableDataElement>
                    <ElementTableTextContainer>
                        <StrongText>{contact.guest_name}</StrongText>
                        <GreyText>{contact.guest_email}</GreyText>
                        <GreyText>{contact.guest_contact}</GreyText>
                    </ElementTableTextContainer>
                </TableDataElement>
                <TableDataElement>
                    <ElementTableTextContainer>
                        <StrongText>{contact.content_title}</StrongText>
                        <GreyText>{contact.content_text}</GreyText>
                    </ElementTableTextContainer>
                </TableDataElement>
                <TableDataElement>{!(contact.is_archived!) ? <ArchiveButton onClick={() => dispatch(archiveContacts(contact.id!))}>Archive</ArchiveButton> : <ArchivedButton>Archived</ArchivedButton>}</TableDataElement>
            </TableRow>
            </>
        );
        }
        
    };

    const createUsersTableRows = (user: User) => {
        if (user) {
            return (
                <>{user.user_name !== "Admin" &&
                <TableRow key={user.id}>
                    <TableDataElement>
                    <TableLink to={`/users/${user.id}`}><ElementTableInfoContainer>
                        <img className="user__photo" src={user.photo} alt="" />
                        <ElementTableTextContainer>
                            <StrongText>{user.user_name}</StrongText>
                            <GreyText>ID {user.id}</GreyText>
                            <GreyText>{user.email}</GreyText>
                        </ElementTableTextContainer>
                    </ElementTableInfoContainer></TableLink>
                    </TableDataElement>

                    <TableDataElement>{user.start_date && tableDateFormat(user.start_date)}</TableDataElement>
                    <TableDataElement><GreyText>{user.job_description}</GreyText></TableDataElement>
                    <TableDataElement><div style={{display:  "flex"}}><img className="phone__icon" src={phone} alt="" />{user.contact}</div></TableDataElement>
                    <TableDataElement className="status"><StatusText status={user.is_active}>{user.is_active ? "ACTIVE" : "INACTIVE"}</StatusText></TableDataElement>
                    <TableDataElement className="delete"><DeleteDots onClick={() => setShowDelete(prev => prev === user.id! ? null : user.id!)}><img src={dots} alt="" />{showDelete === user.id && <DeleteButton onClick={() => deleteUserClickHandler(user.id!)}><img src={trash}/> Delete</DeleteButton>}</DeleteDots></TableDataElement>
                </TableRow>
            }</>
            );
        }
        
    };

    const selectRowRender = (element: Booking | Room | Contact | User) => {
        
        switch (props.section) {
            case "Bookings":
                return createBookingTableRows(element as Booking);
            case "Rooms":
                return createRoomsTableRows(element as Room);
            case "Contacts":
                return createContactsTableRows(element as Contact);
            case "Users":
                return createUsersTableRows(element as User);
            case "Dashboard":
                return createDashboardBookingTableRows(element as Booking);
        }
    }

    const rowsRenderFunction = (element: Booking | Room | Contact | User) => selectRowRender(element);

    return (
       
        <TableContainer>
            <thead>
                <TableHeaderRow key={"header"}>
                    {props.cols.map(col => <TableColumnHeader>{col}</TableColumnHeader>)}
                </TableHeaderRow>
            </thead>
        
            <tbody>
                {props.data.map(element => rowsRenderFunction(element))}
                {/* {modal && <RequestModal><button onClick={() => setModal(false)}>X</button><p>{request}</p></RequestModal>} */}
            </tbody>

            
        </TableContainer>
    );
};