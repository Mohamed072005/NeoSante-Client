"use client"

import {createContext, useContext, useEffect, useState} from "react";
import {Pharmacy} from "@/lib/types/pharmacy";
import usePharmacyApi from "@/hooks/usePharmacyApi";

interface PharmaciesContextType {
    pharmacies: Pharmacy[] | null;
    setPharmaciesContextState: (pharmacies: Pharmacy[] | null) => void;
    findPharmacyById: (id: string) => Promise<Pharmacy | null>;
    updatePharmacy: (pharmacyId: string, propertiesToUpdate: Partial<Pharmacy>) => void;
    removePharmacy: (pharmacyId: string) => void;
}

const PharmaciesContext = createContext<PharmaciesContextType | undefined>(undefined);

export const usePharmaciesContext = () => {
    const context = useContext(PharmaciesContext)
    if (!context){
        throw new Error("usePharmaciesContext must be used within a PharmaciesProvider");
    }
    return context
}

export const PharmaciesProvider = ({ children }: { children: React.ReactNode }) => {
    const [pharmacies, setPharmaciesContextState] = useState<Pharmacy[] | null>(null)
    const { fetchPharmaciesById, fetchPharmacistPharmacies } = usePharmacyApi()

    useEffect(() => {
        const initialValues = async () => {
            if (!pharmacies){
                await fetchPharmacies();
            }
        }
        initialValues();
    }, [])

    const fetchPharmacies = async () => {
        try {
            const response = await fetchPharmacistPharmacies(1, 5);
            setPharmaciesContextState(response?.data?.pharmacies);
        }catch (error) {
            console.log(error);
        }
    }

    const findPharmacyById = async (id: string) => {
        if (!pharmacies) {
            const response = await fetchPharmaciesById(id);
            return response?.data?.pharmacy;
        } else {
            return pharmacies?.find((pharmacy) => pharmacy?._id === id)
        }
    }

    const updatePharmacy = (pharmacyId: string, propertiesToUpdate: Partial<Pharmacy>) => {
        setPharmaciesContextState((prevPharmacies) => {
            if (!prevPharmacies) {
                return null;
            }
            return prevPharmacies.map((pharmacy) =>
                pharmacy._id === pharmacyId
                    ? { ...pharmacy, ...propertiesToUpdate }
                    : pharmacy
            );
        });
    };

    const removePharmacy = (pharmacyId: string) => {
        setPharmaciesContextState((prevPharmacies) => {
            if (!prevPharmacies) {
                return null;
            }
            return prevPharmacies.filter((pharmacy) => pharmacy._id !== pharmacyId);
        });
    }

    return (
        <PharmaciesContext.Provider
            value={{ pharmacies, setPharmaciesContextState, findPharmacyById, updatePharmacy, removePharmacy }}
        >
            {children}
        </PharmaciesContext.Provider>
    );
};