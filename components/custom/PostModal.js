"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FaTimes, FaImage, FaGlobe, FaLock, FaCaretDown, FaChevronLeft, FaChevronRight, FaBold, FaItalic, FaUnderline, FaHeading } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { bindPostData, getGathering, getPosts, initialPostData, setPostModalOpen, storePost, updatePost } from '@/views/gathering/store';
import { getMyProfile, getPostBackgrounds, getUserProfile } from '@/views/settings/store';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { MdPhotoAlbum, MdPhotoLibrary } from 'react-icons/md';
import { LuMapPinCheckInside } from 'react-icons/lu';

const PostModal = () => {
  const {profile, backgroundOptions} = useSelector(({settings}) => settings)
  const { basicPostData, loading, isPostModalOpen} = useSelector(({gathering}) => gathering)
  const dispatch = useDispatch();
  const {id} = basicPostData;
  const [filePreviews, setFilePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrivacyDropdown, setShowPrivacyDropdown] = useState(false);
  const fileInputRef = useRef(null);
  const messageEditorRef = useRef(null);
  const previousMessageRef = useRef(basicPostData?.message ?? '');
  const storedRichMessageRef = useRef('');
  const prevBackgroundActiveRef = useRef(false);
  const [removeFiles, setRemoveFiles] = useState([]);
  const [isShowImageSection, setIsShowImageSection] = useState(id ? true :false);
  const [selectedBackground, setSelectedBackground] = useState(/\/post_background\/.+/.test(basicPostData?.background_url) ? basicPostData?.background_url : null);
  const [backgroundScrollIndex, setBackgroundScrollIndex] = useState(0);
  const [isVisibleBg, setIsVisibleBg] = useState(true);

  // Route / Check-in state
  const [showRoute, setShowRoute] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [checkInMode, setCheckInMode] = useState('checkin'); // 'checkin' or 'route'
  const [showLocationModal, setShowLocationModal] = useState(false); // Controls the sliding modal
  const routeMapContainerRef = useRef(null);
  const routeMapRef = useRef(null);
  const routeMarkersRef = useRef({ origin: null, destination: null, checkin: null });
  const routeLineRef = useRef(null);
  const [routeOrigin, setRouteOrigin] = useState(null); // { lat, lng }
  const [routeDestination, setRouteDestination] = useState(null); // { lat, lng }
  
  // Check-in state
  const [checkInLocation, setCheckInLocation] = useState(null); // { place_name, lat, lng, address }
  const [placeSearchQuery, setPlaceSearchQuery] = useState('');
  const [placeSearchResults, setPlaceSearchResults] = useState([]);
  const [isSearchingPlaces, setIsSearchingPlaces] = useState(false);
  const [showPlaceSearch, setShowPlaceSearch] = useState(false);
  const placeSearchTimeoutRef = useRef(null);

  const params = useParams();

  const isBackgroundActive = useMemo(() => {
    if (!selectedBackground) {
      return false;
    }

    if (typeof selectedBackground === 'string') {
      return true;
    }

    return selectedBackground?.id !== 'white';
  }, [selectedBackground]);

  const visibleBackgrounds = backgroundOptions.slice(backgroundScrollIndex, backgroundScrollIndex + 8);

  const loadLeafletAssets = () => {
    if (typeof window === 'undefined') return Promise.resolve();
    if (window.L) return Promise.resolve();

    return new Promise((resolve, reject) => {
      // CSS
      const existingCss = document.querySelector('link[href*="leaflet.css"]');
      if (!existingCss) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);
      }

      // JS
      const existingJs = document.querySelector('script[src*="leaflet@1.9.4"]');
      if (existingJs) {
        existingJs.addEventListener('load', () => resolve());
        existingJs.addEventListener('error', reject);
        if (window.L) resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.onload = () => resolve();
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  const resetRoute = () => {
    if (routeMarkersRef.current.origin && routeMapRef.current) {
      routeMapRef.current.removeLayer(routeMarkersRef.current.origin);
      routeMarkersRef.current.origin = null;
    }
    if (routeMarkersRef.current.destination && routeMapRef.current) {
      routeMapRef.current.removeLayer(routeMarkersRef.current.destination);
      routeMarkersRef.current.destination = null;
    }
    if (routeMarkersRef.current.checkin && routeMapRef.current) {
      routeMapRef.current.removeLayer(routeMarkersRef.current.checkin);
      routeMarkersRef.current.checkin = null;
    }
    if (routeLineRef.current && routeMapRef.current) {
      routeMapRef.current.removeLayer(routeLineRef.current);
      routeLineRef.current = null;
    }
    setRouteOrigin(null);
    setRouteDestination(null);
    setCheckInLocation(null);
  };

  const resetCheckIn = () => {
    if (routeMarkersRef.current.checkin && routeMapRef.current) {
      routeMapRef.current.removeLayer(routeMarkersRef.current.checkin);
      routeMarkersRef.current.checkin = null;
    }
    setCheckInLocation(null);
    setPlaceSearchQuery('');
    setPlaceSearchResults([]);
  };

  // Search for places using Nominatim (OpenStreetMap geocoding API)
  const searchPlaces = async (query) => {
    if (!query || query.trim().length < 3) {
      setPlaceSearchResults([]);
      return;
    }

    setIsSearchingPlaces(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      const data = await response.json();
      
      const results = data.map((place) => ({
        place_name: place.display_name,
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lon),
        address: place.display_name,
        type: place.type,
        osm_id: place.osm_id
      }));
      console.log(results)
      
      setPlaceSearchResults(results);
    } catch (error) {
      console.error('Error searching places:', error);
      setPlaceSearchResults([]);
    } finally {
      setIsSearchingPlaces(false);
    }
  };

  // Handle place search input with debounce
  useEffect(() => {
    if (placeSearchTimeoutRef.current) {
      clearTimeout(placeSearchTimeoutRef.current);
    }

    if (placeSearchQuery.trim().length >= 3) {
      placeSearchTimeoutRef.current = setTimeout(() => {
        searchPlaces(placeSearchQuery);
      }, 500);
    } else {
      setPlaceSearchResults([]);
    }

    return () => {
      if (placeSearchTimeoutRef.current) {
        clearTimeout(placeSearchTimeoutRef.current);
      }
    };
  }, [placeSearchQuery]);

  // Close place search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPlaceSearch && !event.target.closest('.place-search-container')) {
        setShowPlaceSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPlaceSearch]);

  // Select a place from search results
  const selectPlace = (place) => {
    if (checkInMode === 'destination') {
      setRouteDestination(place);
    } else {
      setCheckInLocation(place);
    }
    setPlaceSearchQuery(place.place_name);
    setPlaceSearchResults([]);
    setShowPlaceSearch(false);
    
    // Add marker to map if map is initialized
    if (routeMapRef.current) {
      // Remove existing check-in marker
      if (routeMarkersRef.current.checkin) {
        routeMapRef.current.removeLayer(routeMarkersRef.current.checkin);
      }
      
      // Add new check-in marker
      const L = window.L;
      const marker = L.marker([place.lat, place.lng], {
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      }).addTo(routeMapRef.current);
      
      marker.bindPopup(`<b>${place.place_name}</b>`).openPopup();
      routeMarkersRef.current.checkin = marker;
      
      // Center map on selected location
      routeMapRef.current.setView([place.lat, place.lng], 15);
    }
    
    // Close modal after selecting (optional - remove if you want to keep it open)
    // setShowLocationModal(false);
  };

  const drawRouteLine = (from, to) => {
    if (!window.L || !routeMapRef.current) return;
    if (routeLineRef.current) {
      routeMapRef.current.removeLayer(routeLineRef.current);
      routeLineRef.current = null;
    }
    routeLineRef.current = window.L.polyline([
      [from.lat, from.lng],
      [to.lat, to.lng]
    ], { color: '#2563eb', weight: 4, opacity: 0.7 }).addTo(routeMapRef.current);
    routeMapRef.current.fitBounds(routeLineRef.current.getBounds(), { padding: [30, 30] });
  };

  // Reset map when mode changes
  useEffect(() => {
    if (showLocationModal && routeMapRef.current) {
      try {
        routeMapRef.current.remove();
      } catch (e) {
        console.error('Error removing map:', e);
      }
      routeMapRef.current = null;
      
      // Clean up the container to allow re-initialization
      if (routeMapContainerRef.current) {
        routeMapContainerRef.current._leaflet_id = null;
        routeMapContainerRef.current.innerHTML = '';
      }
      
      resetRoute();
      resetCheckIn();
    }
  }, [checkInMode]);

  // useEffect(() => {
  //   if (!showLocationModal) {
  //     // Clean up map when modal closes
  //     if (routeMapRef.current) {
  //       try {
  //         routeMapRef.current.remove();
  //       } catch (e) {
  //         console.error('Error removing map:', e);
  //       }
  //       routeMapRef.current = null;
  //     }
      
  //     // Clean up the container
  //     if (routeMapContainerRef.current) {
  //       routeMapContainerRef.current._leaflet_id = null;
  //       routeMapContainerRef.current.innerHTML = '';
  //     }
  //     return;
  //   }
    
  //   let mapInstance = null;
  //   let timeoutId = null;
  //   let retryTimeoutId = null;
    
  //   // Wait for the container to be available (delay for CSS transition)
  //   const initMap = () => {
  //     console.log('initMap called', {
  //       hasMapRef: !!routeMapRef.current,
  //       hasContainerRef: !!routeMapContainerRef.current,
  //       showLocationModal,
  //       checkInMode
  //     });
      
  //     // Check if already initialized or container not ready
  //     if (routeMapRef.current || !routeMapContainerRef.current) {
  //       console.log('Map already initialized or container not ready');
  //       return;
  //     }
      
  //     // Ensure container is actually visible and has dimensions
  //     const container = routeMapContainerRef.current;
     
      
  //     if (!container || container.offsetWidth === 0 || container.offsetHeight === 0) {
  //       console.log('Container has no dimensions, skipping initialization');
  //       return;
  //     }
      
  //     console.log('Loading Leaflet assets...');
      
  //     loadLeafletAssets().then(() => {
  //       // Double check after assets load
  //       if (routeMapRef.current || !routeMapContainerRef.current) return;
        
  //       const L = window.L;
  //       try {
  //         console.log('Initializing Leaflet map...');
          
  //         // Clear any existing leaflet instance from the container
  //         if (routeMapContainerRef.current._leaflet_id) {
  //           console.log('Cleaning up existing leaflet instance...');
  //           routeMapContainerRef.current._leaflet_id = null;
  //           routeMapContainerRef.current.innerHTML = '';
  //         }
          
  //         mapInstance = L.map(routeMapContainerRef.current).setView([23.8103, 90.4125], 5);
  //         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //           attribution: '&copy; OpenStreetMap contributors',
  //           maxZoom: 19
  //         }).addTo(mapInstance);
  //         routeMapRef.current = mapInstance;
  //         console.log('Map initialized successfully!');
          
  //         // Force the map to recalculate its size after initialization
  //         setTimeout(() => {
  //           if (mapInstance) {
  //             console.log('Invalidating map size...');
  //             mapInstance.invalidateSize();
  //           }
  //         }, 100);

  //         // Initialize check-in marker if location is already selected
  //         if (checkInLocation && checkInMode === 'checkin') {
  //           const marker = L.marker([checkInLocation.lat, checkInLocation.lng], {
  //             icon: L.icon({
  //               iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  //               shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  //               iconSize: [25, 41],
  //               iconAnchor: [12, 41],
  //               popupAnchor: [1, -34],
  //               shadowSize: [41, 41]
  //             })
  //           }).addTo(mapInstance);
  //           marker.bindPopup(`<b>${checkInLocation.place_name}</b>`).openPopup();
  //           routeMarkersRef.current.checkin = marker;
  //           mapInstance.setView([checkInLocation.lat, checkInLocation.lng], 15);
  //         }

  //         // Handle map clicks based on mode
  //         if (checkInMode === 'route') {
  //           mapInstance.on('click', (e) => {
  //             const { latlng } = e;
  //             if (!routeMarkersRef.current.origin) {
  //               routeMarkersRef.current.origin = L.marker(latlng, { draggable: true }).addTo(mapInstance);
  //               setRouteOrigin({ lat: latlng.lat, lng: latlng.lng });
  //               routeMarkersRef.current.origin.on('dragend', (ev) => {
  //                 const pos = ev.target.getLatLng();
  //                 setRouteOrigin({ lat: pos.lat, lng: pos.lng });
  //                 if (routeDestination) drawRouteLine({ lat: pos.lat, lng: pos.lng }, routeDestination);
  //               });
  //             } else if (!routeMarkersRef.current.destination) {
  //               routeMarkersRef.current.destination = L.marker(latlng, { draggable: true }).addTo(mapInstance);
  //               setRouteDestination({ lat: latlng.lat, lng: latlng.lng });
  //               routeMarkersRef.current.destination.on('dragend', (ev) => {
  //                 const pos = ev.target.getLatLng();
  //                 setRouteDestination({ lat: pos.lat, lng: pos.lng });
  //                 if (routeOrigin) drawRouteLine(routeOrigin, { lat: pos.lat, lng: pos.lng });
  //               });
  //               drawRouteLine(routeOrigin || latlng, { lat: latlng.lat, lng: latlng.lng });
  //             } else {
  //               // third click resets
  //               resetRoute();
  //             }
  //           });
  //         } else if (checkInMode === 'checkin') {
  //           // For check-in mode, clicking on map can also set location
  //           mapInstance.on('click', (e) => {
  //             const { latlng } = e;
  //             // Reverse geocode to get place name
  //             fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`)
  //               .then(res => res.json())
  //               .then(data => {
  //                 const place = {
  //                   place_name: data.display_name || 'Selected Location',
  //                   lat: latlng.lat,
  //                   lng: latlng.lng,
  //                   address: data.display_name || 'Selected Location'
  //                 };
  //                 selectPlace(place);
  //               })
  //               .catch(() => {
  //                 // Fallback if reverse geocoding fails
  //                 const place = {
  //                   place_name: `Location (${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)})`,
  //                   lat: latlng.lat,
  //                   lng: latlng.lng,
  //                   address: `Location (${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)})`
  //                 };
  //                 selectPlace(place);
  //               });
  //           });
  //         }
  //       } catch (error) {
  //         console.error('Error initializing map:', error);
  //       }
  //     }).catch((error) => {
  //       console.error('Error loading map assets:', error);
  //     });
  //   };
    
  //   // Try after a delay to ensure DOM is ready (for CSS transitions)
  //   // Increased delay to account for the sliding animation
  //   timeoutId = setTimeout(() => {
  //     console.log('First init attempt...');
  //     initMap();
  //     // Try again after another delay if still not initialized
  //     retryTimeoutId = setTimeout(() => {
  //       console.log('Retry init attempt...');
  //       if (!routeMapRef.current && routeMapContainerRef.current) {
  //         console.log('Container exists, retrying initialization');
  //         initMap();
  //       } else {
  //         console.log('Skip retry - map already initialized or container not found');
  //       }
  //     }, 500);
  //   }, 500);
    
  //   return () => {
  //     if (timeoutId) {
  //       clearTimeout(timeoutId);
  //     }
  //     if (retryTimeoutId) {
  //       clearTimeout(retryTimeoutId);
  //     }
      
  //     // Only remove if the map instance still exists and hasn't been removed
  //     const mapToRemove = routeMapRef.current || mapInstance;
  //     if (mapToRemove && mapToRemove._container) {
  //       try {
  //         mapToRemove.remove();
  //       } catch (e) {
  //         // Ignore errors - map might already be removed
  //         console.log('Map cleanup skipped (already removed)');
  //       }
  //     }
      
  //     // Clear refs
  //     routeMapRef.current = null;
  //     mapInstance = null;
      
  //     // Clean up the container
  //     if (routeMapContainerRef.current) {
  //       routeMapContainerRef.current._leaflet_id = null;
  //       routeMapContainerRef.current.innerHTML = '';
  //     }
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [showLocationModal, checkInMode]);

  useEffect(() => {
    // Create a separate ref for main modal map if needed, or reuse the same one
    const mainModalMapContainer = document.getElementById('checkin-map-container');
    const shouldInitMainMap = !showLocationModal && (checkInLocation || routeDestination) && mainModalMapContainer;
    
    if (!showLocationModal && !shouldInitMainMap) {
      // Clean up map when modal closes and no location is selected
      if (routeMapRef.current) {
        try {
          routeMapRef.current.remove();
        } catch (e) {
          console.error('Error removing map:', e);
        }
        routeMapRef.current = null;
      }
      
      // Clean up the container
      if (routeMapContainerRef.current) {
        routeMapContainerRef.current._leaflet_id = null;
        routeMapContainerRef.current.innerHTML = '';
      }
      return;
    }
    
    let mapInstance = null;
    let timeoutId = null;
    let retryTimeoutId = null;
    
    const initMap = () => {
      const container = showLocationModal 
        ? routeMapContainerRef.current 
        : mainModalMapContainer;
      
      if (!container) {
        console.log('Container not found');
        return;
      }
      
      if (routeMapRef.current || container.offsetWidth === 0 || container.offsetHeight === 0) {
        console.log('Map already initialized or container has no dimensions');
        return;
      }
      
      loadLeafletAssets().then(() => {
        if (routeMapRef.current || !container) return;
        
        const L = window.L;
        try {
          // Clear any existing leaflet instance
          if (container._leaflet_id) {
            container._leaflet_id = null;
            container.innerHTML = '';
          }
          
          mapInstance = L.map(container).setView([23.8103, 90.4125], 5);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19
          }).addTo(mapInstance);
          routeMapRef.current = mapInstance;
          
          setTimeout(() => {
            if (mapInstance) {
              mapInstance.invalidateSize();
            }
          }, 100);
  
          // Add markers for selected locations
          if (checkInLocation) {
            const marker = L.marker([checkInLocation.lat, checkInLocation.lng], {
              icon: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              })
            }).addTo(mapInstance);
            marker.bindPopup(`<b>${checkInLocation.place_name}</b>`);
            routeMarkersRef.current.checkin = marker;
          }
  
          if (routeDestination) {
            const marker = L.marker([routeDestination.lat, routeDestination.lng], {
              icon: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              })
            }).addTo(mapInstance);
            marker.bindPopup(`<b>${routeDestination.place_name}</b>`);
            routeMarkersRef.current.destination = marker;
          }
  
          // Draw route line if both locations exist
          if (checkInLocation && routeDestination) {
            drawRouteLine(checkInLocation, routeDestination);
          }
  
          // Fit bounds to show all markers
          if (checkInLocation || routeDestination) {
            const bounds = [];
            if (checkInLocation) bounds.push([checkInLocation.lat, checkInLocation.lng]);
            if (routeDestination) bounds.push([routeDestination.lat, routeDestination.lng]);
            if (bounds.length > 0) {
              mapInstance.fitBounds(bounds, { padding: [50, 50] });
            }
          }
  
          // Only allow click interactions in location modal
          if (showLocationModal) {
            if (checkInMode === 'checkin' || checkInMode === 'destination') {
              mapInstance.on('click', (e) => {
                const { latlng } = e;
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`)
                  .then(res => res.json())
                  .then(data => {
                    const place = {
                      place_name: data.display_name || 'Selected Location',
                      lat: latlng.lat,
                      lng: latlng.lng,
                      address: data.display_name || 'Selected Location'
                    };
                    selectPlace(place);
                  })
                  .catch(() => {
                    const place = {
                      place_name: `Location (${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)})`,
                      lat: latlng.lat,
                      lng: latlng.lng,
                      address: `Location (${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)})`
                    };
                    selectPlace(place);
                  });
              });
            }
          }
        } catch (error) {
          console.error('Error initializing map:', error);
        }
      }).catch((error) => {
        console.error('Error loading map assets:', error);
      });
    };
    
    timeoutId = setTimeout(() => {
      initMap();
      retryTimeoutId = setTimeout(() => {
        if (!routeMapRef.current) {
          initMap();
        }
      }, 500);
    }, 500);
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (retryTimeoutId) clearTimeout(retryTimeoutId);
      
      const mapToRemove = routeMapRef.current || mapInstance;
      if (mapToRemove && mapToRemove._container) {
        try {
          mapToRemove.remove();
        } catch (e) {
          console.log('Map cleanup skipped (already removed)');
        }
      }
      
      routeMapRef.current = null;
      mapInstance = null;
      
      const container = showLocationModal 
        ? routeMapContainerRef.current 
        : mainModalMapContainer;
      if (container) {
        container._leaflet_id = null;
        container.innerHTML = '';
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showLocationModal, checkInMode, checkInLocation, routeDestination]);

  const handleBackgroundSelect = (background) => {
    // Preserve existing text and place it on background
    // if (messageEditorRef.current) {
    //   const currentHtml = messageEditorRef.current.innerHTML || '';
    //   const plainText = getPlainTextFromHtml(currentHtml);
    //   // Store the original HTML for later restoration
    //   storedRichMessageRef.current = "";
      
    //   // Switch to plain text mode for background
    //   messageEditorRef.current.innerText = plainText;
      
    //   // Update state with plain text
    //   dispatch(bindPostData({ ...basicPostData, message: plainText }));
    //   previousMessageRef.current = plainText;
    // }
    // console.log('sdfsdf',previousMessageRef.current)
    const plainText = getPlainTextFromHtml(messageEditorRef.current.innerHTML || "");
    messageEditorRef.current.innerText = "";
   
    dispatch(bindPostData({ ...basicPostData, message: plainText+" " }));
    setSelectedBackground(background);
  };

  const handleBackgroundClear = () => {
    // Restore text when removing background
    if (messageEditorRef.current) {
      const currentPlainText = messageEditorRef.current.innerText || '';
      
      // Convert plain text to HTML paragraphs
      let contentToRestore;
      if (currentPlainText.trim()) {
        contentToRestore = currentPlainText.split('\n').map(line => 
          line.trim() ? `<p>${line.trim()}</p>` : '<p><br></p>'
        ).join('');
      } else {
        // If no text, restore stored content
        contentToRestore = storedRichMessageRef.current || '';
      }
      
      messageEditorRef.current.innerHTML = contentToRestore;
      dispatch(bindPostData({ ...basicPostData, message: contentToRestore }));
      previousMessageRef.current = contentToRestore;
      storedRichMessageRef.current = '';
    }
    setSelectedBackground(null);
  };

  const scrollBackgrounds = (direction) => {
    if (direction === 'left' && backgroundScrollIndex > 0) {
      setBackgroundScrollIndex(backgroundScrollIndex - 1);
    } else if (direction === 'right' && backgroundScrollIndex < backgroundOptions.length - 8) {
      setBackgroundScrollIndex(backgroundScrollIndex + 1);
    }
  };

  const getPlainTextLength = (html) => {
    if (!html) {
      return 0;
    }

    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/gi, ' ')
      .length;
  };

  const getPlainTextFromHtml = (html) => {
    if (!html) {
      return '';
    }

    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(div|p|li|tr|h[1-6])>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/�/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trimEnd();
  };

  const normalizeEditorHtml = (html) => {
    if (!html) {
      return '';
    }

    const trimmed = html.trim();
    if (!trimmed) {
      return '';
    }

    const divToParagraph = trimmed
      .replace(/<div(\s|>)/gi, '<p$1')
      .replace(/<\/div>/gi, '</p>')
      .replace(/<p><\/p>/gi, '');

    const hasBlockTags = /<(p|div|ul|ol|li|blockquote|h[1-6]|pre|table|tbody|thead|tr|td|th)\b/i.test(divToParagraph);
    const hasAnyTag = /<[^>]+>/i.test(divToParagraph);

    if (!hasAnyTag || !hasBlockTags) {
      const rawSegments = divToParagraph.split(/(?:<br\s*\/?>|\r?\n)+/i);

      const paragraphs = rawSegments
        .map((segment) => {
          const content = segment.trim();

          if (!content) {
            return '<p><br></p>';
          }

          return `<p>${content}</p>`;
        });

      if (paragraphs.length === 0) {
        return '';
      }

      return paragraphs.join('');
    }

    return divToParagraph;
  };



  const plainMessageLength = useMemo(() => getPlainTextLength(basicPostData?.message), [basicPostData?.message]);

  
  useEffect(() => {
    dispatch(getMyProfile())
    dispatch(getPostBackgrounds())

    if (isPostModalOpen && id && basicPostData?.files?.length > 0) {
      const previews = basicPostData?.files?.map(file => ({
        id: file.id || (Date.now() + Math.random().toString(36).substring(2, 9)),
        src: `${process.env.NEXT_PUBLIC_FILE_PATH}/post/${file.file_path}`,
        file_type: file?.file_type
      }));
      setFilePreviews(previews);
    }

    return () => {
      setFilePreviews([]);
    }
  }, []);

  useEffect(() => {
    const editor = messageEditorRef.current;
    const nextHtml = basicPostData?.message ?? '';

    if (editor && editor.innerHTML !== nextHtml) {
      editor.innerHTML = nextHtml;
    }

    previousMessageRef.current = nextHtml;
  }, [basicPostData?.message, isPostModalOpen]);

  useEffect(() => {
    const wasBackgroundActive = prevBackgroundActiveRef.current;

    if (isBackgroundActive && !wasBackgroundActive) {
      const currentHtml = messageEditorRef.current?.innerHTML ?? basicPostData?.message ?? '';
      storedRichMessageRef.current = currentHtml;
      const plainText = getPlainTextFromHtml(currentHtml);

      if (messageEditorRef.current) {
        messageEditorRef.current.innerText = plainText;
      }

      previousMessageRef.current = plainText;

      if (basicPostData?.message !== plainText) {
        dispatch(bindPostData({ ...basicPostData, message: plainText }));
      }
    } else if (!isBackgroundActive && wasBackgroundActive) {
      const restoredHtml = storedRichMessageRef.current || basicPostData?.message || '';

      if (messageEditorRef.current) {
        messageEditorRef.current.innerHTML = restoredHtml;
      }

      previousMessageRef.current = restoredHtml;

      if (basicPostData?.message !== restoredHtml) {
        dispatch(bindPostData({ ...basicPostData, message: restoredHtml }));
      }

      storedRichMessageRef.current = '';
    }

    prevBackgroundActiveRef.current = isBackgroundActive;
  }, [basicPostData, dispatch, isBackgroundActive]);

  const handleEditorInput = () => {
  
    const editor = messageEditorRef.current;
    if (!editor) {
      return;
    }
    

    const html = editor.innerHTML;
    const plainLength = getPlainTextLength(html);

    if(selectedBackground){
      editor.style.color = "white"
      editor.style.fontWeight = "bold"
      editor.style.fontSize = "24px"
      editor.style.textAlign = "center"
    }
    
    if (plainLength > 280) {
      setIsVisibleBg(false);
      setSelectedBackground(null);
      storedRichMessageRef.current = '';
    }else{
      setIsVisibleBg(true);
    }

    previousMessageRef.current = html;

    if (basicPostData?.message !== html) {
      dispatch(bindPostData({ ...basicPostData, message: html }));
    }
  };

  const handleEditorPaste = (event) => {
    event.preventDefault();
    
    // Check if there are files (images) in the clipboard
    const items = event.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        // Handle image files
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            // Add the image file to the post data
            dispatch(bindPostData({
              ...basicPostData, 
              files: [...(basicPostData.files || []), file]
            }));
            
            // Generate preview for the pasted image
            const reader = new FileReader();
            reader.onloadend = () => {
              setFilePreviews(prev => [...prev, {
                id: Date.now() + Math.random().toString(36).substring(2, 9),
                src: reader.result,
                file: file
              }]);
            };
            reader.readAsDataURL(file);
            
            // Show image section when image is pasted
            setIsShowImageSection(true);
            
            // Show success message
            toast.success('Image pasted successfully!');
            return;
          }
        }
      }
    }
    
    // If no images, handle text paste
    const textData = event.clipboardData?.getData('text/plain') ?? '';

    if (typeof document !== 'undefined') {
      document.execCommand('insertText', false, textData);
    }

    handleEditorInput();
  };

  const applyTextFormatting = (command, value = null) => {
    if (isBackgroundActive) {
      return;
    }

    const editor = messageEditorRef.current;

    if (!editor || typeof document === 'undefined') {
      return;
    }

    editor.focus();
    document.execCommand(command, false, value);
    handleEditorInput();
  };

  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      dispatch(bindPostData({
        ...basicPostData, 
        files: [...(basicPostData.files || []), ...selectedFiles]
      }));
      
      // Generate previews for the new files
      selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreviews(prev => [...prev, {
            id: Date.now() + Math.random().toString(36).substring(2, 9),
            src: reader.result,
            file: file
          }]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      dispatch(bindPostData({
        ...basicPostData,
        files: [...(basicPostData.files || []), ...droppedFiles]
      }));
      
      // Generate previews for the new files
      droppedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreviews(prev => [...prev, {
            id: Date.now() + Math.random().toString(36).substring(2, 9),
            src: reader.result,
            file: file
          }]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveFile = (idToRemove) => {
    const previewToRemove = filePreviews.find(preview => preview.id === idToRemove);
    if (previewToRemove) {
      // If the file has an id (existing file), add to removeFiles
      if (previewToRemove.id && typeof previewToRemove.id === 'number') {
        setRemoveFiles(prev => [...prev, previewToRemove.id]);
      }
      // Remove from previews
      setFilePreviews(filePreviews.filter(preview => preview.id !== idToRemove));
      // Remove from basicPostData.files as well
      dispatch(bindPostData({
        ...basicPostData,
        files: basicPostData.files.filter(file => {
          // For new files, compare by object reference
          if (file instanceof File) {
            return file !== previewToRemove.file;
          }
          // For existing files, compare by id
          return file.id !== previewToRemove.id;
        })
      }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handlePrivacyChange = (mode) => {
    dispatch(bindPostData({...basicPostData, privacy_mode: mode}))
    setShowPrivacyDropdown(false);
  };


  
  const handlePost = async () => {        
    try {
      setIsSubmitting(true);

      // Create FormData for API request
      const editorContent = messageEditorRef.current ? messageEditorRef.current.innerHTML : basicPostData?.message ?? '';
      const editorPlainText = messageEditorRef.current ? messageEditorRef.current.innerText.replace(/\r/g, '') : getPlainTextFromHtml(editorContent);

      const normalizedContent = isBackgroundActive
        ? editorPlainText
        : normalizeEditorHtml(editorContent);

      const messageContent = isBackgroundActive
        ? editorPlainText.trim()
        : getPlainTextLength(normalizedContent) === 0 ? '' : normalizedContent;

      if (basicPostData?.message !== messageContent) {
        dispatch(bindPostData({ ...basicPostData, message: messageContent }));
      }


      const formData = new FormData();
      formData.append('message', messageContent);
      formData.append('privacy_mode', basicPostData.privacy_mode);

      // Build post_locations array
      const postLocations = [];

      // Add check-in location (post_type: 1)
      if (checkInLocation) {
        postLocations.push({
          post_type: 1,
          place_name: checkInLocation.place_name || '',
          lat: checkInLocation.lat,
          lon: checkInLocation.lng, // API uses 'lon' not 'lng'
          address: checkInLocation.address || checkInLocation.place_name || '',
          type: checkInLocation.type || '',
          place_id: checkInLocation.osm_id || checkInLocation.place_id || null,
          place_rank: checkInLocation.place_rank || 0,
          name: checkInLocation.name || checkInLocation.place_name.split(',')[0] || ''
        });
      }

      // Add destination location (post_type: 2)
      if (routeDestination) {
        postLocations.push({
          post_type: 2,
          place_name: routeDestination.place_name || '',
          lat: routeDestination.lat,
          lon: routeDestination.lng, // API uses 'lon' not 'lng'
          address: routeDestination.address || routeDestination.place_name || '',
          type: routeDestination.type || '',
          place_id: routeDestination.osm_id || routeDestination.place_id || null,
          place_rank: routeDestination.place_rank || 0,
          name: routeDestination.name || routeDestination.place_name.split(',')[0] || ''
        });
      }

      // Add post_locations to FormData as array
      if (postLocations.length > 0) {
        postLocations.forEach((location, index) => {
          formData.append(`post_locations[${index}][post_type]`, location.post_type);
          formData.append(`post_locations[${index}][place_name]`, location.place_name);
          formData.append(`post_locations[${index}][lat]`, String(location.lat));
          formData.append(`post_locations[${index}][lon]`, String(location.lon));
          formData.append(`post_locations[${index}][address]`, location.address);
          formData.append(`post_locations[${index}][type]`, location.type);
          formData.append(`post_locations[${index}][place_id]`, String(location.place_id || ''));
          formData.append(`post_locations[${index}][place_rank]`, String(location.place_rank));
          formData.append(`post_locations[${index}][name]`, location.name);
        });
      }
      
      // // Add check-in location data
      // if (checkInLocation) {
      //   formData.append('checkin_place_name', checkInLocation.place_name);
      //   formData.append('checkin_lat', String(checkInLocation.lat));
      //   formData.append('checkin_lng', String(checkInLocation.lng));
      //   formData.append('checkin_address', checkInLocation.address || checkInLocation.place_name);
      // }
      
      // // Add route data (if route mode is used)
      // if (routeOrigin && routeDestination) {
      //   formData.append('origin_lat', String(routeOrigin.lat));
      //   formData.append('origin_lng', String(routeOrigin.lng));
      //   formData.append('destination_lat', String(routeDestination.lat));
      //   formData.append('destination_lng', String(routeDestination.lng));
      // }
      
      if (messageContent?.length < 280 && selectedBackground) {
        formData.append('background_url', selectedBackground?.image?.path);
      }

      // Add files if present
      if (basicPostData.files?.length > 0) {
        basicPostData.files.forEach((file, index) => {
          if (file instanceof File) {
            formData.append(`files[${index}]`, file);
          }
        });
      }

      // Add remove_files if any
      if (removeFiles.length > 0) {
        formData.append('removefiles', removeFiles);
      }

      const action = id ? updatePost({ id, ...Object.fromEntries(formData) }) : storePost(formData);
      dispatch(action)
        .then(() => {
          dispatch(getGathering());
          dispatch(getPosts());
          dispatch(bindPostData(initialPostData));
          setFilePreviews([]);
          setRemoveFiles([]);
          setSelectedBackground(null);
          setBackgroundScrollIndex(0);
          setShowCheckIn(false);
          setShowRoute(false);
          setShowLocationModal(false);
          setCheckInLocation(null);
          setPlaceSearchQuery('');
          setPlaceSearchResults([]);
          resetRoute();
          resetCheckIn();
          dispatch(setPostModalOpen(false));
          if (params?.id) {
            dispatch(getUserProfile(params?.id));
          }
          dispatch(getMyProfile());
        });
    } catch (error) {
      console.error('Error posting:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const close = () => {
    dispatch(setPostModalOpen(false));
    dispatch(bindPostData(initialPostData));
    setSelectedBackground(null);
    setBackgroundScrollIndex(0);
    setShowCheckIn(false);
    setShowRoute(false);
    setShowLocationModal(false);
    setCheckInLocation(null);
    setPlaceSearchQuery('');
    setPlaceSearchResults([]);
    resetRoute();
    resetCheckIn();
   }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white backdrop-blur-md rounded-lg w-full max-w-lg mx-4 shadow-xl flex flex-col relative overflow-hidden" style={{ height: '600px', maxHeight: '90vh' }}>
        {/* Header */}
        <div className="flex justify-center border-b border-b-gray-300 p-4 relative flex-shrink-0">
          <div className="flex items-center justify-between w-full">
            {showLocationModal && (
              <button
                onClick={() => setShowLocationModal(false)}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FaChevronLeft size={20} />
              </button>
            )}
            <h2 className="text-xl font-semibold flex-1 text-center">
              {showLocationModal 
                ? (checkInMode === 'checkin' ? 'Check in at a place' : 'Add route (from → to)')
                : (id ? "Edit Post" : "Create post")}
            </h2>
            <button
              onClick={() => {
                close();
              }}
              className="text-gray-500 bg-gray-200 p-2 rounded-full cursor-pointer hover:text-gray-700"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {/* Slider Container */}
        <div className="relative flex-1" style={{ minHeight: 0, position: 'relative', overflow: 'visible' }}>
          {/* Main Post Modal Content */}
          <div 
            className={`w-full h-full flex flex-col transition-transform duration-300 ease-in-out ${
              showLocationModal ? 'absolute inset-0 -translate-x-full' : 'relative translate-x-0'
            }`}
            style={{ zIndex: showLocationModal ? 0 : 2 }}
          >
            <div className="p-4 overflow-y-auto flex-1">
              <div className="flex items-start mb-4">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-400 flex items-center justify-center text-white mr-3 flex-shrink-0">
              <img
                src={
                  profile?.client?.image
                    ? process.env.NEXT_PUBLIC_CLIENT_FILE_PATH +
                      profile?.client?.image
                    : "/common-avator.jpg"
                }
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/common-avator.jpg";
                }}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className='flex items-center gap-5'>
              <div className="font-semibold text-gray-900">
                {profile?.client?.fname + " " + profile?.client?.last_name}
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className={`flex items-center cursor-pointer px-2 py-1 rounded-md transition-colors ${
                    checkInLocation ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setCheckInMode('checkin');
                    setShowLocationModal(true);
                  }} 
                >
                  <LuMapPinCheckInside size={15} className='text-red-600 mr-1'/>
                  <span className="text-sm">Check in</span>
                </div>
                <div 
                  className={`flex items-center cursor-pointer px-2 py-1 rounded-md transition-colors ${
                    routeDestination ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setCheckInMode('destination');
                    setShowLocationModal(true);
                  }} 
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm">Destination</span>
                </div>
              </div>
              </div>

              <div className="flex items-center mt-1">
                <div className="relative">
                  <button
                    onClick={() => setShowPrivacyDropdown(!showPrivacyDropdown)}
                    className="flex items-center font-[500] text-[13px] bg-gray-200 px-2 py-1 rounded-md cursor-pointer hover:bg-gray-300 transition-colors"
                  >
                    {basicPostData?.privacy_mode === "public" ? (
                      <>
                        <FaGlobe size={12} className="mr-1" />
                        <span>Public</span>
                      </>
                    ) : (
                      <>
                        <FaLock size={12} className="mr-1" />
                        <span>Private</span>
                      </>
                    )}
                    <FaCaretDown className="ml-1" />
                  </button>

                  {showPrivacyDropdown && (
                    <div className="absolute left-0 mt-1 bg-white shadow-md rounded-md z-10 w-36 overflow-hidden border">
                      <button
                        onClick={() => handlePrivacyChange("public")}
                        className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100"
                      >
                        <FaGlobe className="mr-2" />
                        <span>Public</span>
                      </button>
                      <button
                        onClick={() => handlePrivacyChange("private")}
                        className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100"
                      >
                        <FaLock className="mr-2" />
                        <span>Private</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 mb-4">
            {plainMessageLength > 280 ? (
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.preventDefault();
                    applyTextFormatting("bold");
                  }}
                  className="p-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 focus:outline-none"
                  aria-label="Bold"
                  title="Bold"
                >
                  <FaBold size={14} />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.preventDefault();
                    applyTextFormatting("italic");
                  }}
                  className="p-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 focus:outline-none"
                  aria-label="Italic"
                  title="Italic"
                >
                  <FaItalic size={14} />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.preventDefault();
                    applyTextFormatting("underline");
                  }}
                  className="p-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 focus:outline-none"
                  aria-label="Underline"
                  title="Underline"
                >
                  <FaUnderline size={14} />
                </button>
                {/* <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  e.preventDefault();
                  applyTextFormatting('formatBlock', 'H1');
                }}
                className="p-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 focus:outline-none"
                aria-label="Heading level 1"
                title="Heading 1"
              >
                <FaHeading size={14} />
              </button> */}
              </div>
            ) : (
              ""
            )}
            {selectedBackground &&
            selectedBackground?.id !== "white" &&
            plainMessageLength < 280 ? (
              <div
                className="relative w-full min-h-[400px] rounded-lg flex items-center justify-center bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: selectedBackground?.image?.url
                    ? `url(${selectedBackground.image.url})`
                    : `url(${basicPostData?.background_url})`,
                  paddingBottom: "100px",
                }}
              >
                <div className="relative w-full max-w-md">
                  {!plainMessageLength && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute left-30 top-10 text-white/70"
                    >{`What's on your mind, ${profile?.client?.fname}?`}</span>
                  )}
                  <div
                    ref={messageEditorRef}
                    className="w-full border-0 resize-none outline-none p-4 text-white text-center bg-transparent min-h-[120px] max-h-[200px] text-[24px] font-medium whitespace-pre-wrap break-words"
                    contentEditable
                    role="textbox"
                    aria-multiline="true"
                    onInput={handleEditorInput}
                    onBlur={handleEditorInput}
                    onPaste={handleEditorPaste}
                    suppressContentEditableWarning
                  />
                </div>
              </div>
            ) : (
              <div className="relative">
                {!plainMessageLength && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-4 text-gray-400"
                  >{`What's on your mind, ${profile?.client?.fname}?`}</span>
                )}
                <div
                  ref={messageEditorRef}
                  className="w-full border-0 outline-none p-4 transition-all duration-200 text-lg text-gray-700 bg-transparent min-h-[120px] whitespace-pre-wrap break-words"
                  contentEditable
                  role="textbox"
                  aria-multiline="true"
                  onInput={handleEditorInput}
                  onBlur={handleEditorInput}
                  onPaste={handleEditorPaste}
                  suppressContentEditableWarning
                />
              </div>
            )}
          </div>

          {(checkInLocation || routeDestination) && (
            <div className="mb-4">
              <div
                ref={routeMapContainerRef}
                id="checkin-map-container"
                className="w-full rounded-md border border-gray-200"
                style={{ height: '384px', width: '100%', position: 'relative', zIndex: 0 }}
              />
              <div className="mt-2 text-xs text-gray-600">
                {checkInLocation && routeDestination
                  ? `Route: ${checkInLocation.place_name.split(',')[0]} → ${routeDestination.place_name.split(',')[0]}`
                  : checkInLocation
                    ? `Check-in: ${checkInLocation.place_name}`
                    : `Destination: ${routeDestination.place_name}`
                }
              </div>
            </div>
          )}

          {/* Background Selection Row */}
          {(!checkInLocation && !routeDestination) && 
          <div className="mb-1">
            <div className="flex items-center space-x-2 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {/* Left Arrow */}
              {backgroundScrollIndex > 0 && (
                <button
                  onClick={() => scrollBackgrounds("left")}
                  className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <FaChevronLeft size={12} className="text-gray-600" />
                </button>
              )}

              {/* White Background Option */}
              <div
                onClick={handleBackgroundClear}
                className={`flex-shrink-0 w-8 h-8 rounded-md border-2 transition-all duration-200 hover:scale-110 bg-white cursor-pointer ${
                  selectedBackground?.id === "white"
                    ? "border-white scale-110 shadow-lg"
                    : "border-gray-300"
                }`}
                title="White"
              />

              {/* Background Swatches */}
              {isVisibleBg &&
                visibleBackgrounds?.map((bg) => (
                  <img
                    key={bg.id}
                    src={bg?.image?.url}
                    onClick={() => handleBackgroundSelect(bg)}
                    className={`flex-shrink-0 w-8 h-8 rounded-md border-2 transition-all duration-200 hover:scale-110 ${
                      selectedBackground?.id === bg.id
                        ? "border-white scale-110 shadow-lg"
                        : "border-gray-300"
                    }`}
                    title={bg.name}
                  />
                ))}

              {/* Right Arrow */}
              {backgroundScrollIndex < backgroundOptions.length - 8 && (
                <button
                  onClick={() => scrollBackgrounds("right")}
                  className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <FaChevronRight size={12} className="text-gray-600" />
                </button>
              )}
            </div>
          </div>}

         
          {(!selectedBackground && !checkInLocation && !routeDestination) && (
            <div className="">
              <p
                className={`text-gray-500 mb-2 text-center cursor-pointer ${
                  !isShowImageSection ? "border py-2 pl-2 rounded-md" : ""
                }`}
                onClick={() => {
                  setIsShowImageSection(!isShowImageSection);
                }}
              >
                Upload Photos/Videos
              </p>
              {isShowImageSection && (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer bg-white/50 hover:bg-white/70 transition"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  {filePreviews?.length > 0 ? (
                    <div>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        {filePreviews?.map((preview) => (
                          <div key={preview.id} className="relative">
                            {preview?.file?.type.startsWith("video/") ? (
                              <video
                                controls
                                className="h-32 w-full object-cover rounded"
                              >
                                <source src={preview?.src} />
                              </video>
                            ) : (
                              <img
                                src={preview?.src}
                                alt="Upload preview"
                                className="h-32 w-full object-cover rounded"
                              />
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFile(preview.id);
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                            >
                              <FaTimes size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className="text-blue-500 text-sm mt-2">
                        Add more files
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-center mb-2">
                        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                          <FaImage className="text-gray-400 text-3xl" />
                        </div>
                      </div>
                      <p className="text-gray-500">
                        Drag here or click to upload photos/videos.
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFilesChange}
                    accept="image/*,video/*"
                    className="hidden"
                    multiple
                  />
                </div>
              )}
            </div>
          )}

          {/* Display selected check-in location */}
          {checkInLocation && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start flex-1">
                  <LuMapPinCheckInside size={20} className="text-red-600 mr-2 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {checkInLocation.place_name.split(',')[0]}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {checkInLocation.place_name}
                    </div>
                  </div>
                </div>
                <button
                  onClick={resetCheckIn}
                  className="text-gray-500 hover:text-gray-700 ml-2"
                >
                  <FaTimes size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Display route when both check-in and destination are set */}
          {(checkInLocation && routeDestination) && (
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-md border-2 border-blue-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start flex-1">
                  <div className="text-blue-600 mr-2 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 mb-2">
                      Traveling Route
                    </div>
                    <div className="text-xs text-gray-700 space-y-2">
                      <div className="flex items-start">
                        <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2 mt-0.5 flex-shrink-0"></span>
                        <div>
                          <div className="font-medium">From:</div>
                          <div className="text-gray-600">{checkInLocation.place_name}</div>
                        </div>
                      </div>
                      <div className="ml-1.5 border-l-2 border-dashed border-gray-400 h-4"></div>
                      <div className="flex items-start">
                        <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2 mt-0.5 flex-shrink-0"></span>
                        <div>
                          <div className="font-medium">To:</div>
                          <div className="text-gray-600">{routeDestination.place_name}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    resetCheckIn();
                    setRouteDestination(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 ml-2"
                >
                  <FaTimes size={14} />
                </button>
              </div>
            </div>
          )}
          
          {/* Display only check-in when no destination */}
          {checkInLocation && !routeDestination && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start flex-1">
                  <LuMapPinCheckInside size={20} className="text-red-600 mr-2 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {checkInLocation.place_name.split(',')[0]}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {checkInLocation.place_name}
                    </div>
                  </div>
                </div>
                <button
                  onClick={resetCheckIn}
                  className="text-gray-500 hover:text-gray-700 ml-2"
                >
                  <FaTimes size={14} />
                </button>
              </div>
            </div>
          )}
          
          {/* Display only destination when no check-in */}
          {!checkInLocation && routeDestination && (
            <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start flex-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      Destination: {routeDestination.place_name.split(',')[0]}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {routeDestination.place_name}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setRouteDestination(null)}
                  className="text-gray-500 hover:text-gray-700 ml-2"
                >
                  <FaTimes size={14} />
                </button>
              </div>
            </div>
          )}
            </div>
            
            {/* Post Button */}
            <div className="px-4 pb-4 flex-shrink-0 border-t border-gray-200">
              <button
                onClick={handlePost}
                className={`px-4 py-2 w-full rounded-md transition font-medium ${
                  loading ||
                  (plainMessageLength === 0 && !basicPostData?.files?.length)
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                }`}
                disabled={
                  loading ||
                  (plainMessageLength === 0 && !basicPostData?.files?.length)
                }
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>

        {/* Inner Sliding Panel for Check-in / Destination */}
        {showLocationModal && (
        <div
          className="absolute inset-0 bg-white flex flex-col"
          style={{ zIndex: 10, height: '100%' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0" style={{ flexShrink: 0 }}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowLocationModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <FaChevronLeft size={18} />
                </button>
                <h3 className="text-lg font-semibold text-gray-900">
                  {checkInMode === 'checkin' ? 'Check in at a place' : 'Add route (from → to)'}
                </h3>
              </div>
              <button
                onClick={() => setShowLocationModal(false)}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4" style={{ flex: 1, minHeight: 0, overflowY: 'auto', backgroundColor: '#f9fafb' }}>
               
                {(checkInMode === 'checkin' || checkInMode === 'destination') ? (
                  <>
                    <div className="mb-4">
                      {/* Place Search */}
                      <div className="relative mb-3 place-search-container">
                        <input
                          type="text"
                          placeholder="Search for a place..."
                          value={placeSearchQuery}
                          onChange={(e) => {
                            setPlaceSearchQuery(e.target.value);
                            setShowPlaceSearch(true);
                          }}
                          onFocus={() => setShowPlaceSearch(true)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        
                        {/* Search Results Dropdown */}
                        {showPlaceSearch && placeSearchResults?.length > 0 && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {isSearchingPlaces && (
                              <div className="px-3 py-2 text-sm text-gray-500">Searching...</div>
                            )}
                            {placeSearchResults?.map((place, index) => (
                              <div
                                key={index}
                                onClick={() => selectPlace(place)}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                              >
                                <div className="text-sm font-medium text-gray-900">
                                  {place.place_name.split(',')[0]}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                  {place.place_name}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Selected Location Display */}
                      {((checkInMode === 'checkin' && checkInLocation) || (checkInMode === 'destination' && routeDestination)) && (
                        <div className={`mb-3 p-3 rounded-md border ${
                          checkInMode === 'destination' 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-blue-50 border-blue-200'
                        }`}>
                          <div className="flex items-start justify-between">
                            <div className="flex items-start flex-1">
                              {checkInMode === 'destination' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              ) : (
                                <LuMapPinCheckInside size={20} className="text-red-600 mr-2 mt-0.5" />
                              )}
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900">
                                  {checkInMode === 'destination' 
                                    ? routeDestination?.place_name.split(',')[0] 
                                    : checkInLocation?.place_name.split(',')[0]
                                  }
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                  {checkInMode === 'destination' 
                                    ? routeDestination?.place_name 
                                    : checkInLocation?.place_name
                                  }
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                if (checkInMode === 'destination') {
                                  setRouteDestination(null);
                                } else {
                                  resetCheckIn();
                                }
                              }}
                              className="text-gray-500 hover:text-gray-700 ml-2"
                            >
                              <FaTimes size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Map for Check-in */}
                    <div className="mb-4">
                      <div
                        ref={(checkInMode === 'checkin' || checkInMode === 'destination') ? routeMapContainerRef : null}
                        id="checkin-map-container"
                        className="w-full rounded-md border border-gray-200"
                        style={{ height: '384px', width: '100%', position: 'relative', zIndex: 0 }}
                      />
                      <div className="mt-2 text-xs text-gray-600">
                        {(checkInMode === 'checkin' && !checkInLocation) || (checkInMode === 'destination' && !routeDestination)
                          ? "Search for a place above or click on the map to select a location."
                          : checkInMode === 'destination' && routeDestination
                            ? `Selected: ${routeDestination.place_name}`
                            : checkInLocation
                              ? `Selected: ${checkInLocation.place_name}`
                              : "Search for a place above or click on the map to select a location."}
                      </div>
                     
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Please select a mode
                  </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={() => setShowLocationModal(false)}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
              >
                Done
              </button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default PostModal;



