import React, { useState, useEffect } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { useOrganization } from '../context/OrganizationContext';
import Banner from './Banner';
import { Banner as BannerType, getBannersQuery } from '../lib/banner';

const BannerCarousel: React.FC = () => {
  const { currentOrganization } = useOrganization();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [banners, setBanners] = useState<BannerType[]>([]);

  useEffect(() => {
    if (!currentOrganization?.id) return;

    const query = getBannersQuery(currentOrganization.id);
    const unsubscribe = onSnapshot(query, (snapshot) => {
      const bannersData = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as BannerType[];

      // Filter and sort banners in memory
      const now = new Date();
      const activeBanners = bannersData
        .filter(banner => {
          const start = banner.startDate ? new Date(banner.startDate) : null;
          const end = banner.endDate ? new Date(banner.endDate) : null;
          
          if (start && start > now) return false;
          if (end && end < now) return false;
          
          return true;
        })
        .sort((a, b) => (b.order || 0) - (a.order || 0));

      setBanners(activeBanners);
    });

    return () => unsubscribe();
  }, [currentOrganization?.id]);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex((current) => 
        current === banners.length - 1 ? 0 : current + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const currentBanner = banners[currentBannerIndex];

  return (
    <div className="relative">
      <Banner
        key={currentBanner.id}
        type={currentBanner.type}
        title={currentBanner.title}
        message={currentBanner.message}
      />
      
      {banners.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBannerIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentBannerIndex
                  ? 'bg-blue-500 w-4'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Bannière ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerCarousel;