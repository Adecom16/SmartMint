import Link from "next/link";
import React from "react";

interface Log {
  name: string;
  args: any[];
}

interface EventTableProps {
  logs: Log[];
  address: string;
}

const EventTable: React.FC<EventTableProps> = ({ logs, address }) => (
  <div className="mt-2">
    <div className="flex justify-between items-center">
      <h2 className="mb-4 text-2xl font-bold">Successful events</h2>
      <Link href={`https://scan.test.btcs.network/address/${address}`} target="_blank" className="text-purple-600 hover:underline ">View all events</Link>
    </div>
    <div className="relative overflow-x-auto rounded">
      <table className="w-full text-left text-sm_ text-gray-500 dark:text-gray-400 rtl:text-right">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Event
            </th>
            <th scope="col" className="px-6 py-3">
              From
            </th>
            <th scope="col" className="px-6 py-3">
              To
            </th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr
              key={index}
              className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <th
                scope="row"
                className="cursor-pointer whitespace-nowrap px-6 py-4 font-medium"
              >
                {log.name}
              </th>
              <td className="px-6 py-4">
                {String(log.args[0]).substring(0, 8)}...
                {String(log.args[0]).substring(
                  String(log.args[0]).length - 9,
                  String(log.args[0]).length
                )}
              </td>
              <td className="px-6 py-4">
                {String(log.args[1]).substring(0, 8)}...
                {String(log.args[1]).substring(
                  String(log.args[1]).length - 9,
                  String(log.args[1]).length
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default EventTable;
