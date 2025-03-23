/**
 * @title : UF ACM - Fullstack Web Development workshop demo template
 * 
 * @description : This is a simple RSVP app that allows users to submit their name and email 
 * to RSVP for an event. 
 * 
 * @implements : This template uses Supabase as a backend to store Event and RSVP data. Refer
 * to the Readme for instructions on how to set up the Supabase project and tables.
 * 
 * @notes : This is a template, please customize the code and project structre to fit your own 
 * project needs
 * 
 * @author : Alexander Fisher
 * 
 * @date : March 2025
 */

/** 
 * this enables the use of client-specific features such as React
 * state, and event handlers
*/
"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

/**
 * this is the demo event id
 * in a real app you would pass this as a prop or get it from the url
 */
const DEMO_EVENT_ID = 1;

// main component for this template
export default function Home() {
  /**
   * state variables for the form data, the list of attendees,
   * the message to show after submission and the event data
   * 
   * the messages are not strictly necessary but are useful for user feedback
   */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [attendees, setAttendees] = useState([]);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [eventData, setEventData] = useState("");

  /**
   * useeffect to fetch event and rsvps after component mounts
   * also set up realtime subscription for new rsvps
   */
  useEffect(() => {
    fetchEvent();
    fetchRSVPs();

    // set up realtime subscription to listen for new rsvps
    const channel = supabase
      .channel("rsvps_channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "rsvps",
          filter: `event_id=eq.${DEMO_EVENT_ID}`,
        },
        (payload) => {
          // update attendees list with new rsvp
          setAttendees((prev) => [...prev, payload.new]);
          // update guest count in event data
          setEventData((prev) =>
            prev ? { ...prev, guest_count: prev.guest_count + 1 } : prev
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  /**
   * fetch the event data from the events table
   */
  async function fetchEvent() {
    // this is how you query for the event data from supabase
    const { data, error } = await supabase
      .from("Events")
      .select("*")
      .eq("id", DEMO_EVENT_ID)
      .single();
    if (error) {
      console.error("error fetching event", error);
    } else {
      // set event data to state
      setEventData(data);
    }
  }

  /**
   * fetch the list of rsvps for the event from the rsvps table
   */
  async function fetchRSVPs() {
    // this is how you query for the rsvp data from supabase
    const { data, error } = await supabase
      .from("rsvps")
      .select("*")
      .eq("event_id", DEMO_EVENT_ID);
    if (error) {
      console.error("error fetching rsvps", error);
    } else {
      // set attendees to state
      setAttendees(data);
    }
  }

  /**
   * handle form submission to insert a new rsvp
   */
  async function handleSubmit(e) {
    // this will prevent the form from refreshing the page
    e.preventDefault();
    // reset the message
    setMessage("");

    // check that all fields are filled
    if (!name.trim() || !email.trim()) {
      setMessage("please fill in all fields");
      return;
    }

    // check for duplicate rsvp by email for this event
    const { data: existing, error: dupError } = await supabase
      .from("rsvps")
      .select("*")
      .eq("email", email)
      .eq("event_id", DEMO_EVENT_ID);

    if (dupError) {
      setMessage("error checking for duplicates");
      console.error(dupError);
      return;
    }

    if (existing && existing.length > 0) {
      setMessage("an rsvp with this email already exists for this event");
      return;
    }

    // here instead we call the .insert method to add a new rsvp to the supabase rsvps tbl
    const { error: insertError } = await supabase
      .from("rsvps")
      .insert([{ event_id: DEMO_EVENT_ID, name, email }]);

    if (insertError) {
      setMessage("error while submitting your rsvp");
      console.error(insertError);
      return;
    }

    // if everythings good, show message and set success bool to true
    setMessage("rsvp submitted successfully");
    setSuccess(true);
    // reset other state variables 
    setName("");
    setEmail("");

    // newGuestCount is the current guest count or 0 + 1
    const newGuestCount = (eventData?.guest_count || 0) + 1;
    // here we call the .update method to update the guest count 
    // for the event with the matching id
    const { error: updateError } = await supabase
      .from("Events")
      .update({ guest_count: newGuestCount })
      .eq("id", DEMO_EVENT_ID);

    if (updateError) {
      console.error("error updating guest count", updateError);
    } else {
      // here we set the event state variable using the spread 
      // operator while passing in the previous state for conditional checking
      setEventData((prev) =>
        prev ? { ...prev, guest_count: newGuestCount } : prev
      );
    }
  }

  // component render
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-6 text-white">
        {/* this is an example of conditional rendering based on if the event data is loaded or not */}
        rsvp for <b className="text-purple-500">{eventData ? eventData.event_name : "loading event..."}</b>
      </h1>

      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded shadow">
        {message && (
          // this is an example of conditional rendering based on the success state but for className instead of content
          <p className={`mb-4 text-center ${success ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>
        )}
        <div className="mb-4">
          <label htmlFor="name" className="block mb-1 font-semibold text-gray-900">
            name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="your name"
            required
            className="w-full p-2 border rounded text-gray-900"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 font-semibold text-gray-900">
            email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your email"
            required
            className="w-full p-2 border rounded text-gray-900"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
          submit rsvp
        </button>
      </form>

      <div className="mt-8 w-full max-w-md bg-white p-6 rounded shadow text-gray-900">
        <h2 className="flex justify-center text-xl font-bold mb-4">
          {/* this is another conditional to render the guest count */}
          Guest Count : {eventData ? eventData.guest_count : attendees.length}
        </h2>
        <ul>
          {/* the .map method is a more efficient way to iterate thru arrays in js */}
          {attendees.map((attendee) => (
            <li key={attendee.id} className="border-b py-2">
              <p className="font-semibold">{attendee.name}</p>
              <p className="text-sm text-gray-600">{attendee.email}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
