import React, { useEffect } from "react";
import styled from "styled-components";
import { useSection } from "../components/Layout";
import bed from "../assets/bed.png"
import calendar from "../assets/Calendar_add.svg"
import check_in from "../assets/check_in.svg"
import check_out from "../assets/check_out.svg"
import { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { useAppDispatch, useAppSelector } from "../app/store";
import { loadContacts } from "../features/contacts/contactsThunks";
import { ContactSlider } from "../components/ContactsSlider";
import { BookingsCalendar } from "../components/BookingsCalendar";
import { Table } from "../components/Table";
import { filterBookingsArray } from "./Bookings/Bookings";
import { Booking, Room } from "../interfaces/interfaces";
import { loadBookings } from "../features/bookings/bookingsThunks";
import { loadRooms } from "../features/rooms/roomsThunks";
import { Triangle } from "react-loader-spinner";

const KPIContainer = styled.section`
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr;
    column-gap: 30px;
    margin-bottom: 50px;
`;

const KPIElement = styled.div`
    background-color: #FFFFFF;
    display: flex;
    align-items: center;
    height: 125px;
    box-shadow: 0px 4px 4px #00000005;
    border-radius: 12px;
    :hover {
        cursor:pointer;
        transform: scale(1.05);
        box-shadow: 0px 16px 30px #00000014;
        .hover {
            cursor: pointer;
            background-color: #E23428;
            img {
                filter: brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(0%) hue-rotate(143deg) brightness(105%) contrast(108%);
            }
            transition: all 0.5s;
        }
        transition: all 0.3s;
    }
`;

const KPILogoContainer = styled.div`
    background-color: #FFEDEC;
    height: 65px;
    width: 65px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    margin: 30px;
    img {
        width: 50%;
        filter: brightness(0) saturate(100%) invert(26%) sepia(45%) saturate(2444%) hue-rotate(338deg) brightness(111%) contrast(106%);
    }
`;

const KPIBoldText = styled.h3`
    color: #393939;
    font-size: 30px;
    font-weight: 600;
    margin: 0;
`;

const KPIText = styled.p`
    color: #787878;
    font-size: 14px;
    font-weight: 300;
    margin: 0;
`;

const LatestBookingsContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 20px;
    margin-bottom: 50px;
`;

const CalendarContainer = styled.div`
    width: 40%;
`;

const TableContainer = styled.div`
    width: 55%;
`;

const getLatestBookings = (array: Booking[], quantity: number) => {
    let aux = array ? [...array] : [];
    aux = aux.sort((a,b) => Date.parse(a.check_in) - Date.parse(b.check_in))

    return aux.slice(0, quantity);
}

const getBookingsStats = (array: Booking[], request: string) => {
    
    let aux = array ? [...array] : [];

    switch (request) {
        case "All":
            return aux.length;
        case "Check In":
            return aux.filter(booking => booking.status === "Check In").length;
        case "Check Out":
            return aux.filter(booking => booking.status === "Check Out").length;
    }
}

const getRoomsBooked = (array: Room[]) => {
    let aux = array ? [...array] : [];

    return aux.filter(room => room.is_available === false).length || 0;
}



export const Dashboard = (): React.JSX.Element => {

    const dispatch = useAppDispatch();
    const bookingsData = useAppSelector(state => state.bookings.data);
    const bookingsStatus = useAppSelector(state => state.bookings.status);
    const roomsData = useAppSelector(state => state.rooms.data);
    const roomsStatus = useAppSelector(state => state.rooms.status);
    const {sectionName, setSectionName} = useSection();

    useEffect(() => {
        setSectionName("Dashboard");
        if (bookingsStatus === "idle") {
            dispatch(loadBookings())
        }
        if (roomsStatus === "idle") {
            dispatch(loadRooms())
        }
    }, [bookingsData, roomsData, dispatch])

    const displayLoader = () => {
        if (bookingsStatus === "pending" || roomsStatus === "pending") {
          return true
        }
        return false
      }

    return (<>
        {displayLoader() && <Triangle
            height="200"
            width="200"
            color="#135846"
            ariaLabel="triangle-loading"
            wrapperStyle={{position: "absolute", top: "40%", left: "50%"}}
            visible={true}
            />}
        {!displayLoader() && <> <KPIContainer>
            <KPIElement>
                <KPILogoContainer className="hover"><img src={bed}/></KPILogoContainer>
                <div>
                    <KPIBoldText>{getBookingsStats(bookingsData, "All")}</KPIBoldText>
                    <KPIText>New Bookings</KPIText>
                </div>
            </KPIElement>

            <KPIElement>
                <KPILogoContainer className="hover"><img src={calendar}/></KPILogoContainer>
                <div>
                    <KPIBoldText>{getRoomsBooked(roomsData)}</KPIBoldText>
                    <KPIText>Scheduled Rooms</KPIText>
                </div>
            </KPIElement>
            <KPIElement>
                <KPILogoContainer className="hover"><img src={check_in}/></KPILogoContainer>
                <div>
                    <KPIBoldText>{getBookingsStats(bookingsData, "Check In")}</KPIBoldText>
                    <KPIText>Check In</KPIText>
                </div>
            </KPIElement>
            <KPIElement>
                <KPILogoContainer className="hover"><img src={check_out}/></KPILogoContainer>
                <div>
                    <KPIBoldText>{getBookingsStats(bookingsData, "Check Out")}</KPIBoldText>
                    <KPIText>Check Out</KPIText>
                </div>
            </KPIElement>
        </KPIContainer>
        <LatestBookingsContainer>
            <CalendarContainer>
                <BookingsCalendar bookings={bookingsData}/>
            </CalendarContainer>
            <TableContainer>
                <Table section={"Dashboard"} cols={["Room", "Info", "Date"]} data={getLatestBookings(bookingsData, 3)}/>
            </TableContainer>
        </LatestBookingsContainer>
        <ContactSlider/> </>}
    </>)
};