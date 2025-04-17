


const DriverStandings = () => {

    return (
        <>
        <h1 style={{fontFamily: 'F1FontBold'  ,fontSize:'1.5rem'}}> Positions Live Feed </h1>
        <div class="relative overflow-x-auto">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" class="px-6 py-3">
                        Driver
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Interval
                    </th>
                </tr>
            </thead>
            <tbody>

                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        Charles Leclerc
                    </th>
                    <td class="px-6 py-4">
                        +0
                    </td>
                   
                </tr>
              
            </tbody>
        </table>
    </div>
    </>
    )
}

export default DriverStandings