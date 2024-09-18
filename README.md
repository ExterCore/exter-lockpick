# exter-lockpick
EXTER-LOCKPICK TAKES INSPIRATION FROM ONE OF THE ROLEPLAY SERVERS, NOPIXEL 4.0

![npx](https://github.com/user-attachments/assets/fbc2e0b9-a833-4b05-a205-9ab9b958dd57)


qb-vehiclekeys usage

STEP 1 : DELETED qb-lockpick

STEP 2 : FOLLOW THESE INSTRUCTIONS


search this in qb-vehiclekeys/client/main.lua

for old repository qb-vehiclekeys

    RegisterNetEvent('lockpicks:UseLockpick', function(isAdvanced)
        LockpickDoor(isAdvanced)
    end)

for new repository qb-vehiclekeys

    RegisterNetEvent('lockpicks:UseLockpick', function(isAdvanced)
        local ped = PlayerPedId()
        local pos = GetEntityCoords(ped)
        local vehicle = QBCore.Functions.GetClosestVehicle()

    if vehicle == nil or vehicle == 0 then return end
    if HasKeys(QBCore.Functions.GetPlate(vehicle)) then return end
    if #(pos - GetEntityCoords(vehicle)) > 2.5 then return end
    if GetVehicleDoorLockStatus(vehicle) <= 0 then return end

    local difficulty = isAdvanced and 'easy' or 'medium' -- Easy for advanced lockpick, medium by default
    local success = exports['qb-minigames']:Skillbar(difficulty)

    local chance = math.random()
    if success then
        TriggerServerEvent('hud:server:GainStress', math.random(1, 4))
        lastPickedVehicle = vehicle

        if GetPedInVehicleSeat(vehicle, -1) == PlayerPedId() then
            TriggerServerEvent('qb-vehiclekeys:server:AcquireVehicleKeys', QBCore.Functions.GetPlate(vehicle))
        else
            QBCore.Functions.Notify(Lang:t('notify.vlockpick'), 'success')
            TriggerServerEvent('qb-vehiclekeys:server:setVehLockState', NetworkGetNetworkIdFromEntity(vehicle), 1)
        end
    else
        TriggerServerEvent('hud:server:GainStress', math.random(1, 4))
        AttemptPoliceAlert('steal')
    end

    if isAdvanced then
        if chance <= Config.RemoveLockpickAdvanced then
            TriggerServerEvent('qb-vehiclekeys:server:breakLockpick', 'advancedlockpick')
        end
    else
        if chance <= Config.RemoveLockpickNormal then
            TriggerServerEvent('qb-vehiclekeys:server:breakLockpick', 'lockpick')
        end
    end
    end)

and replace with this code

    RegisterNetEvent('lockpicks:UseLockpick', function(isAdvanced)
        local ped = PlayerPedId()
        local pos = GetEntityCoords(ped)
        local vehicle = QBCore.Functions.GetClosestVehicle()

    if vehicle == nil or vehicle == 0 then return end
    if HasKeys(QBCore.Functions.GetPlate(vehicle)) then return end
    if #(pos - GetEntityCoords(vehicle)) > 2.5 then return end
    if GetVehicleDoorLockStatus(vehicle) <= 0 then return end

    -- Corrected the resource name in the call
    exports['exter-lockpick']:OpenLockpickMinigame(function(success)
        if success then
            -- Logic for successful lockpicking
            TriggerServerEvent('hud:server:GainStress', math.random(1, 4))
            lastPickedVehicle = vehicle

            if GetPedInVehicleSeat(vehicle, -1) == PlayerPedId() then
                TriggerServerEvent('qb-vehiclekeys:server:AcquireVehicleKeys', QBCore.Functions.GetPlate(vehicle))
            else
                QBCore.Functions.Notify(Lang:t("notify.vlockpick"), 'success')
                TriggerServerEvent('qb-vehiclekeys:server:setVehLockState', NetworkGetNetworkIdFromEntity(vehicle), 1)
            end
        else
            -- Logic for failed lockpicking
            TriggerServerEvent('hud:server:GainStress', math.random(1, 4))
            AttemptPoliceAlert("steal")
        end
    end, vehicle, isAdvanced and 'advanced' or 'normal')  -- Adjust parameters as needed
    end)

to make game shorter / faster adjust the time from the OpenDevice function in client.lua
see below example for time adjustment

    function OpenDevice(successCallback, target, time)
        SetNuiFocus(true, true)
        time = 50  -- Change to suit your needs 
        SendNUIMessage({type = "open", target = target, time = time})




ORIGINAL REPOSITORY
( https://github.com/MaximilianAdF/NoPixel-MiniGames-4.0 )
