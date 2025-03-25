"use client"

import {useState} from "react";
import {pharmacyService} from "@/lib/api/pharmacy";
import {FindPharmaciesSearchParams, PharmacyFormData, UsePharmacyAPI} from "@/lib/types/pharmacy";
import {handleConstraintError} from "@/lib/utils/handleConstraintsErrors";

const usePharmacyApi = (): UsePharmacyAPI => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const createPharmacy = async (pharmacy: PharmacyFormData) => {
        setLoading(true);
        try {
            const response = await pharmacyService.askCreatePharmacy(pharmacy);
            setLoading(false);
            return response;
        }catch (e: unknown) {
            const {message, constraints} = handleConstraintError(e);
            setError(message as string);
            setLoading(false);
            throw constraints as string || message;
        }finally {
            setLoading(false);
        }
    }

    const fetchAdminPharmacies = async (page: number, limit: number) => {
        setLoading(true);
        try {
            const response = await pharmacyService.getPharmaciesForAdmin(page, limit);
            setLoading(false);
            return response;
        }catch (e: unknown) {
            const {message, constraints} = handleConstraintError(e);
            setError(message as string);
            setLoading(false);
            throw constraints as string || message;
        }finally {
            setLoading(false);
        }
    }

    const fetchPharmaciesById = async (id: string) => {
        setLoading(true);
        try {
            const response = await pharmacyService.getPharmacyById(id);
            return response;
        }catch (e: unknown) {
            const {message, constraints} = handleConstraintError(e);
            setError(message as string);
            throw constraints as string || message;
        }finally {
            setLoading(false);
        }
    }

    const approvePharmacy = async (id: string) => {
        try {
            const response = await pharmacyService.handleApprovePharmacy(id)
            return response;
        }catch (e: unknown) {
            const {message, constraints} = handleConstraintError(e);
            setError(message as string);
            throw constraints as string || message;
        }
    }

    const fetchPharmacistPharmacies = async (page: number, limit: number) => {
        setLoading(true);
        try {
            const response = await pharmacyService.getPharmaciesForPharmacist(page, limit);
            return response;
        }catch (e) {
            const {message, constraints} = handleConstraintError(e);
            setError(message as string);
            throw constraints as string || message;
        }finally {
            setLoading(false);
        }
    }

    const updatePharmacy = async (id: string, pharmacy: PharmacyFormData) => {
        setLoading(true);
        try {
            console.log("try request");
            const response = await pharmacyService.updatePharmacy(id, pharmacy);
            return response;
        }catch (e) {
            console.log(e);
            const {message, constraints} = handleConstraintError(e);
            setError(message as string);
            throw constraints as string || message;
        }finally {
            setLoading(false);
        }
    }

    const deletePharmacy = async (pharmacy_id: string) => {
        try {
            const response = await pharmacyService.handleDeletePharmacy(pharmacy_id);
            return response;
        }catch (e) {
            const {message, constraints} = handleConstraintError(e);
            setError(message as string);
            throw constraints as string || message;
        }
    }

    const findPharmacies = async (searchParams: FindPharmaciesSearchParams) => {
        setLoading(true);
        try {
            const response = await pharmacyService.findPharmacies(searchParams);
            return response;
        }catch (e) {
            const {message, constraints} = handleConstraintError(e);
            setError(message as string);
            throw constraints as string || message;
        }finally {
            setLoading(false);
        }
    }

    return {
        fetchAdminPharmacies,
        createPharmacy,
        fetchPharmaciesById,
        approvePharmacy,
        fetchPharmacistPharmacies,
        updatePharmacy,
        deletePharmacy,
        findPharmacies,
        loading,
        error
    }
}

export default usePharmacyApi;