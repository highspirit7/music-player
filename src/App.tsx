import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import BottomControlBar from '@/components/bottomControlBar';
import { useStore } from '@/store';
import LeftSideBar from '@/components/leftSideBar';

function App() {
  const fetchTracks = useStore(state => state.fetchTracks);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <LeftSideBar />

        {/* Main Content Area */}
        <Outlet />
      </div>
      <BottomControlBar />
    </div>
  );
}

export default App;
